import { IUserRepository } from "entities/user/IUserRepository"
import { IJwtService } from "services/JwtService/IJwtService"
import { singleton, inject } from "tsyringe"
import { JwtToken, RefreshTokenData } from "./types"

@singleton()
export class SignOut {

  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('JwtService') private readonly jwtService: IJwtService
  ) { }


  async execute(refreshToken: JwtToken): Promise<void> {
    const decodedResult = await this.jwtService.decode<RefreshTokenData>(refreshToken)
    if (!decodedResult.ok) {
      return
    }
    await this.userRepository.deleteTokenById(decodedResult.value.id)
  }
}
