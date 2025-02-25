import { singleton, inject } from "tsyringe"
import { RefreshTokenData } from "../DTOs"
import { ITokenProvider } from "authentication/services/TokenProvider/ITokenProvider"
import { IUserRepository } from "user/IUserRepository"

@singleton()
export class SignOut {

  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('TokenProvider') private readonly tokenProvider: ITokenProvider
  ) { }


  async execute(refreshToken: string): Promise<void> {
    const decodedResult = await this.tokenProvider.decode<RefreshTokenData>(refreshToken)
    if (!decodedResult.ok) {
      return
    }
    await this.userRepository.deleteTokenById(decodedResult.value.id)
  }
}
