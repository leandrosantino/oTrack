import { SignOut } from "./SignOut"
import { AlreadyUsedToken, ExpiredTokenException, InvalidTokenException, TokenProvider } from "authentication/services/TokenProvider/TokenProvider"
import { UserRepository } from "user/repository/UserRepository"
import { UserProfile } from "user/dto/UserProfile"
import { TokenPair } from "authentication/dto/TokenPair"
import { RefreshTokenData } from "authentication/dto/RefreshTokenData"
import { Inject, Injectable } from "@nestjs/common"

@Injectable()
export class RefreshTokens {

  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('TokenProvider') private readonly tokenProvider: TokenProvider,
    private readonly signOut: SignOut
  ) { }


  async execute(refreshToken: string): Promise<TokenPair> {
    const jwtVerifyResult = await this.tokenProvider.verify<RefreshTokenData>(refreshToken)

    if (jwtVerifyResult.failure) {
      if (jwtVerifyResult.error instanceof ExpiredTokenException) {
        await this.signOut.execute(refreshToken)
      }
      throw jwtVerifyResult.error
    }

    const refreshTokenData = jwtVerifyResult.value
    const savedTokenData = await this.userRepository.getTokenById(refreshTokenData.id)

    if (savedTokenData === null) {
      await this.userRepository.deleteTokensByUserId(refreshTokenData.userId)
      throw new AlreadyUsedToken()
    }

    const { user } = savedTokenData
    this.userRepository.deleteTokenById(savedTokenData.id)

    const createdToken = await this.userRepository.createToken(user.id)

    const newRefreshToken = this.tokenProvider.generateRefreshToken(createdToken)
    const newAccessToken = this.tokenProvider.generateAccessToken(new UserProfile(user))

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }

  }
}
