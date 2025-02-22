import { TokenException } from "application/security/TokenException"
import { singleton, inject } from "tsyringe"
import { JwtToken } from "./types"
import { Validator } from "application/validation/Validator"
import { TokenProvider } from "application/security/TokenProvider"
import { UserProfile } from "domain/entities/user/UserProfile"

@singleton()
export class VerifyToken {

  constructor(
    @inject('JwtService') private readonly jwtService: TokenProvider,
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
