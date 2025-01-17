import { inject, injectable } from "tsyringe";
import { IAuthService } from "./IAuthService";
import { AuthRequestDTO, JwtToken, AccessTokenData, RefreshTokenData, AuthResponseDTO } from "./IAuthServiceDTO";
import jwt, { VerifyErrors, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'
import { IUserRepository } from 'entities/user/IUserRepository'
import { SignInExceptions, TokenExceptions } from "./AuthExceptions";
import { Properties } from "utils/Properties";
import { IPasswordHasher } from "services/PasswordHasher/IPasswordHasher";


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

    const accessTokenData: AccessTokenData = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      roule: user.roule
    }

    const refreshTokenData: RefreshTokenData = { id: user.id }

    const accessToken = jwt.sign(accessTokenData, this.properties.env.JWT_SECRET, {
      expiresIn: this.properties.env.ACCESS_TOKEN_EXPIRES
    })

    const refreshToken = this.generateRefreshToken(refreshTokenData)

    return Ok({ accessToken, refreshToken })
  }

  private generateRefreshToken(refreshTokenData: RefreshTokenData) {
    return jwt.sign(refreshTokenData, this.properties.env.JWT_SECRET, {
      expiresIn: this.properties.env.REFRESH_TOKEN_EXPIRES
    })
  }

  async verifyToken(token: JwtToken): AsyncResult<AccessTokenData, TokenExceptions> {
    const { err, data } = await new Promise<{ err: any, data: any }>(resolve => {
      jwt.verify(token, this.properties.env.JWT_SECRET, (err, data) => resolve({ err, data }))
    })

    if (err instanceof TokenExpiredError) {
      return Err(TokenExceptions.EXPIRES_TOKEN)
    }

    if (err instanceof JsonWebTokenError) {
      return Err(TokenExceptions.INVALID_TOKEN)
    }


    return Ok(data as AccessTokenData)
  }


}
