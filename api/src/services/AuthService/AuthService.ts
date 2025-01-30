import { inject, injectable } from "tsyringe";
import { IAuthService, AuthRequestDTO, JwtToken, AccessTokenData, RefreshTokenData, AuthResponseDTO } from "./IAuthService";
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'
import { IUserRepository } from 'entities/user/IUserRepository'
import { SignInExceptions } from "./AuthExceptions";
import { IPasswordHasher } from "services/PasswordHasher/IPasswordHasher";
import { AsyncResult } from "interfaces/Result";
import { TOKEN_DATA_SCHEMA } from "schemas/TokenDataSchema";
import { TokenExceptions } from "services/JwtService/TokenExceptions";
import { IJwtService } from "services/JwtService/IJwtService";


@injectable()
export class AuthService implements IAuthService {

  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('PasswordHasher') private readonly passwordHasher: IPasswordHasher,
    @inject('JwtService') private readonly jwtService: IJwtService,
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

    const refreshToken = this.jwtService.generateRefreshToken(createdToken)
    const accessToken = this.jwtService.generateAccessToken({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      roule: user.roule
    })

    return Ok({ accessToken, refreshToken })
  }

  async signOut(refreshToken: JwtToken): Promise<void> {
    const decodedResult = await this.jwtService.decode<RefreshTokenData>(refreshToken)
    if (!decodedResult.ok) {
      return
    }
    await this.userRepository.deleteTokenById(decodedResult.value.id)
  }

  async refreshTokens(refreshToken: JwtToken): AsyncResult<AuthResponseDTO, TokenExceptions> {
    const jwtVerifyResult = await this.jwtService.verify<RefreshTokenData>(refreshToken)

    if (!jwtVerifyResult.ok) {
      if (jwtVerifyResult.err.type === TokenExceptions.EXPIRED_TOKEN) {
        await this.signOut(refreshToken)
      }
      return Err(jwtVerifyResult.err.type)
    }

    const refreshTokenData = jwtVerifyResult.value
    const savedTokenData = await this.userRepository.getTokenById(refreshTokenData.id)

    if (savedTokenData === null) {
      await this.userRepository.deleteTokensByUserId(refreshTokenData.userId)
      // Enviar alerta ao desenvolvedor que ouve uma tentativa suspeita de renovar um token de acesso
      return Err(TokenExceptions.INVALID_TOKEN)
    }

    const { user } = savedTokenData
    this.userRepository.deleteTokenById(savedTokenData.id)

    const createdToken = await this.userRepository.createToken(user.id)

    const newRefreshToken = this.jwtService.generateRefreshToken(createdToken)
    const newAccessToken = this.jwtService.generateAccessToken({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      roule: user.roule
    })

    return Ok({ accessToken: newAccessToken, refreshToken: newRefreshToken })

  }

  async verifyToken(token: JwtToken): AsyncResult<AccessTokenData, TokenExceptions> {

    const jwtVerifyResult = await this.jwtService.verify<AccessTokenData>(token)

    if (!jwtVerifyResult.ok) {
      return Err(jwtVerifyResult.err.type)
    }

    const { success, data: tokenData } = await TOKEN_DATA_SCHEMA.spa(jwtVerifyResult.value)
    if (!success) {
      return Err(TokenExceptions.INVALID_TOKEN)
    }

    return Ok(tokenData)
  }


}
