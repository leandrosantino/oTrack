import { UserProfile } from "entities/user/UserProfile"
import { IJwtService } from "services/JwtService/IJwtService"
import { TokenException } from "entities/user/exceptions/TokenException"
import { singleton, inject } from "tsyringe"
import { JwtToken } from "./types"
import { Validator } from "interfaces/Validator"

@singleton()
export class VerifyToken {

  constructor(
    @inject('JwtService') private readonly jwtService: IJwtService,
    @inject('UserProfileValidator') private readonly userProfileValidator: Validator<UserProfile>
  ) { }


  async execute(token: JwtToken): AsyncResult<UserProfile, TokenException> {

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
