import { singleton, inject } from "tsyringe"
import { AuthResponseDTO, RefreshTokenData } from "../DTOs"
import { SignOut } from "./SignOut"
import { TokenException } from "authentication/exceptions/TokenException"
import { ITokenProvider } from "authentication/services/TokenProvider/ITokenProvider"
import { IUserRepository } from "user/IUserRepository"
import { UserProfile } from "user/UserProfile"

@singleton()
export class RefreshTokens {

  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('TokenProvider') private readonly tokenProvider: ITokenProvider,
    @inject('SignOut') private readonly signOut: SignOut
  ) { }


  async execute(refreshToken: string): AsyncResult<AuthResponseDTO, TokenException> {
    const jwtVerifyResult = await this.tokenProvider.verify<RefreshTokenData>(refreshToken)

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
      return Err(new TokenException.AlreadyUsedToken())
    }

    const { user } = savedTokenData
    this.userRepository.deleteTokenById(savedTokenData.id)

    const createdToken = await this.userRepository.createToken(user.id)

    const newRefreshToken = this.tokenProvider.generateRefreshToken(createdToken)
    const newAccessToken = this.tokenProvider.generateAccessToken(new UserProfile(user))

    return Ok({ accessToken: newAccessToken, refreshToken: newRefreshToken })

  }
}
