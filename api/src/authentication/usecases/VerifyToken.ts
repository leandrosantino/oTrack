import { Inject, Injectable } from "@nestjs/common"
import { TokenProvider } from "authentication/services/TokenProvider/TokenProvider"
import { UserProfile } from "user/dto/UserProfile"

@Injectable()
export class VerifyToken {

  constructor(
    @Inject('TokenProvider') private readonly tokenProvider: TokenProvider
  ) { }

  async execute(token: string): Promise<UserProfile> {
    const jwtVerifyResult = await this.tokenProvider.verify<UserProfile>(token)
    return jwtVerifyResult.orElseThrow()
  }
}
