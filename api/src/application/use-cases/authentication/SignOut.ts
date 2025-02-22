import { singleton, inject } from "tsyringe"
import { JwtToken, RefreshTokenData } from "./types"
import { TokenProvider } from "application/security/TokenProvider"
import { IUserRepository } from "domain/entities/user/IUserRepository"

@singleton()
export class SignOut {

  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('JwtService') private readonly jwtService: TokenProvider
  ) { }


  async execute(refreshToken: JwtToken): Promise<void> {
    const decodedResult = await this.jwtService.decode<RefreshTokenData>(refreshToken)
    if (!decodedResult.ok) {
      return
    }
    await this.userRepository.deleteTokenById(decodedResult.value.id)
  }
}
