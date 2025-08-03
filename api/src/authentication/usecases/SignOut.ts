import { TokenProvider } from "authentication/services/TokenProvider/TokenProvider"
import { UserRepository } from "user/repository/UserRepository"
import { RefreshTokenData } from "authentication/dto/RefreshTokenData"
import { Inject, Injectable } from "@nestjs/common"

@Injectable()
export class SignOut {

  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('TokenProvider') private readonly tokenProvider: TokenProvider
  ) { }


  async execute(refreshToken: string): Promise<void> {
    const decodedResult = await this.tokenProvider.decode<RefreshTokenData>(refreshToken)
    if (decodedResult.failure) {
      return
    }
    await this.userRepository.deleteTokenById(decodedResult.value.id)
  }
}
