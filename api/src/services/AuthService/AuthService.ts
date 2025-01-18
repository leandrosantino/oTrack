import { inject, injectable } from "tsyringe";
import { IAuthService, AuthRequestDTO, JwtToken, AccessTokenData, RefreshTokenData, AuthResponseDTO } from "./IAuthService";
import jwt, { VerifyErrors, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'
import { IUserRepository } from 'entities/user/IUserRepository'
import { SignInExceptions, TokenExceptions } from "./AuthExceptions";
import { Properties } from "utils/Properties";
import { IPasswordHasher } from "services/PasswordHasher/IPasswordHasher";
import { AsyncResult } from "interfaces/Result";


@injectable()
export class AuthService implements IAuthService {

  constructor(
    @inject('Properties') private readonly properties: Properties,
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('PasswordHasher') private readonly passwordHasher: IPasswordHasher
  ) { }

  async signIn({ username, password }: AuthRequestDTO): AsyncResult<AuthResponseDTO, SignInExceptions> {
    const user = await this.userRepository.getByUsername(username)

    if (!user) {
      return Err(SignInExceptions.USER_NOT_FOUND)
    }

    if (!(await this.passwordHasher.verify(password, user.password))) {
      return Err(SignInExceptions.INVALID_PASSWORD)
    }

    const createdToken = await this.userRepository.createToken(user.id)

    const refreshToken = this.generateRefreshToken(createdToken)
    const accessToken = this.generateAccessToken({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      roule: user.roule
    })

    return Ok({ accessToken, refreshToken })
  }

  private generateRefreshToken(refreshTokenData: RefreshTokenData) {
    return jwt.sign(refreshTokenData, this.properties.env.JWT_SECRET, {
      expiresIn: this.properties.env.REFRESH_TOKEN_EXPIRES
    })
  }

  private generateAccessToken(accessTokenData: AccessTokenData) {
    return jwt.sign(accessTokenData, this.properties.env.JWT_SECRET, {
      expiresIn: this.properties.env.ACCESS_TOKEN_EXPIRES
    })
  }

  async refreshTokens(refreshToken: JwtToken): AsyncResult<AuthResponseDTO, TokenExceptions> {
    const { err, data } = await new Promise<{ err: any, data: any }>(resolve => {
      jwt.verify(refreshToken, this.properties.env.JWT_SECRET, (err, data) => resolve({ err, data }))
    })

    if (err instanceof TokenExpiredError) return Err(TokenExceptions.EXPIRES_TOKEN)
    if (err instanceof JsonWebTokenError) return Err(TokenExceptions.INVALID_TOKEN)

    const refreshTokenData = data as RefreshTokenData
    const savedTokenData = await this.userRepository.getTokenById(refreshTokenData.id)

    if (savedTokenData === null) {
      await this.userRepository.deleteTokensByUserId(refreshTokenData.userId)
      // Enviar alerta ao desenvolvedor que ouve uma tentativa suspeita de renovar um token de acesso
      return Err(TokenExceptions.INVALID_TOKEN)
    }

    const { user } = savedTokenData
    this.userRepository.deleteTokenById(savedTokenData.id)

    const createdToken = await this.userRepository.createToken(user.id)

    const newRefreshToken = this.generateRefreshToken(createdToken)
    const newAccessToken = this.generateAccessToken({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      roule: user.roule
    })

    return Ok({ accessToken: newAccessToken, refreshToken: newRefreshToken })

  }

  async verifyToken(token: JwtToken): AsyncResult<AccessTokenData, TokenExceptions> {
    const { err, data } = await new Promise<{ err: any, data: any }>(resolve => {
      jwt.verify(token, this.properties.env.JWT_SECRET, (err, data) => resolve({ err, data }))
    })

    if (err instanceof TokenExpiredError) return Err(TokenExceptions.EXPIRES_TOKEN)
    if (err instanceof JsonWebTokenError) return Err(TokenExceptions.INVALID_TOKEN)

    return Ok(data as AccessTokenData)
  }


}
