import { TokenException } from "application/security/TokenException"
import { singleton, inject } from "tsyringe"
import { JwtToken, AuthResponseDTO, RefreshTokenData } from "./types"
import { SignOut } from "./SignOut"
import { Logger } from "application/logging/Logger"
import { TokenProvider } from "application/security/TokenProvider"
import { IUserRepository } from "domain/entities/user/IUserRepository"
import { UserProfile } from "domain/entities/user/UserProfile"

@singleton()
export class RefreshTokens {

  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('JwtService') private readonly jwtService: TokenProvider,
    @inject('Logger') private readonly logger: Logger,
    @inject('SignOut') private readonly signOut: SignOut
  ) { }


  async execute(refreshToken: JwtToken): AsyncResult<AuthResponseDTO, TokenException> {
    const jwtVerifyResult = await this.jwtService.verify<RefreshTokenData>(refreshToken)

    if (!jwtVerifyResult.ok) {
      if (jwtVerifyResult.err instanceof TokenException.ExpiredToken) {
        await this.signOut.execute(refreshToken)
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
}
