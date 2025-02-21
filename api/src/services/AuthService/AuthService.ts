import { inject, injectable } from "tsyringe";
import { IAuthService, AuthRequestDTO, JwtToken, RefreshTokenData, AuthResponseDTO } from "./IAuthService";
import { IUserRepository } from 'entities/user/IUserRepository'
import { IPasswordHasher } from "services/PasswordHasher/IPasswordHasher";
import { AsyncResult } from "interfaces/Result";
import { TokenException } from "services/JwtService/TokenException";
import { IJwtService } from "services/JwtService/IJwtService";
import { Logger } from "interfaces/Logger";
import { Validator } from "interfaces/Validator";
import { SignInException } from "entities/user/exceptions/SignInException";
import { UserProfile } from "entities/user/UserProfile";


@injectable()
export class AuthService implements IAuthService {

  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('PasswordHasher') private readonly passwordHasher: IPasswordHasher,
    @inject('JwtService') private readonly jwtService: IJwtService,
    @inject('Logger') private readonly logger: Logger,
    @inject('UserProfileValidator') private readonly userProfileValidator: Validator<UserProfile>,
  ) { }

  async signIn({ username, password }: AuthRequestDTO): AsyncResult<AuthResponseDTO, SignInException> {
    const user = await this.userRepository.getByUsername(username)

    if (!user) {
      return Err(new SignInException.UserNotFound())
    }

    if (!(await this.passwordHasher.verify(password, user.password))) {
      return Err(new SignInException.UserNotFound())
    }

    const createdToken = await this.userRepository.createToken(user.id)

    const accessToken = this.jwtService.generateAccessToken(new UserProfile(user))
    const refreshToken = this.jwtService.generateRefreshToken(createdToken)

    return Ok({ accessToken, refreshToken })
  }

  async signOut(refreshToken: JwtToken): Promise<void> {
    const decodedResult = await this.jwtService.decode<RefreshTokenData>(refreshToken)
    if (!decodedResult.ok) {
      return
    }
    await this.userRepository.deleteTokenById(decodedResult.value.id)
  }

  async refreshTokens(refreshToken: JwtToken): AsyncResult<AuthResponseDTO, TokenException> {
    const jwtVerifyResult = await this.jwtService.verify<RefreshTokenData>(refreshToken)

    if (!jwtVerifyResult.ok) {
      if (jwtVerifyResult.err instanceof TokenException.ExpiredToken) {
        await this.signOut(refreshToken)
      }
      return Err(jwtVerifyResult.err)
    }

    const refreshTokenData = jwtVerifyResult.value
    const savedTokenData = await this.userRepository.getTokenById(refreshTokenData.id)

    if (savedTokenData === null) {
      await this.userRepository.deleteTokensByUserId(refreshTokenData.userId)
      this.logger.info('Attempt to refresh tokens using a discarded token')
      return Err(new TokenException.InvalidToken())
    }

    const { user } = savedTokenData
    this.userRepository.deleteTokenById(savedTokenData.id)

    const createdToken = await this.userRepository.createToken(user.id)

    const newRefreshToken = this.jwtService.generateRefreshToken(createdToken)
    const newAccessToken = this.jwtService.generateAccessToken(new UserProfile(user))

    return Ok({ accessToken: newAccessToken, refreshToken: newRefreshToken })

  }

  async verifyToken(token: JwtToken): AsyncResult<UserProfile, TokenException> {

    const jwtVerifyResult = await this.jwtService.verify<UserProfile>(token)

    if (!jwtVerifyResult.ok) {
      return Err(jwtVerifyResult.err)
    }

    const tokenDataParsResult = this.userProfileValidator.parse(jwtVerifyResult.value)
    if (!tokenDataParsResult.ok) {
      return Err(new TokenException.InvalidToken())
    }

    return Ok(tokenDataParsResult.value)
  }


}
