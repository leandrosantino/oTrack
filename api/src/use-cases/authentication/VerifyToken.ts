import { UserProfile } from "entities/user/UserProfile"
import { ITokenProvider } from "services/TokenProvider/ITokenProvider"
import { TokenException } from "entities/user/exceptions/TokenException"
import { singleton, inject } from "tsyringe"
import { Validator } from "interfaces/Validator"

@singleton()
export class VerifyToken {

  constructor(
    @inject('TokenProvider') private readonly tokenProvider: ITokenProvider,
    @inject('UserProfileValidator') private readonly userProfileValidator: Validator<UserProfile>
  ) { }


  async execute(token: string): AsyncResult<UserProfile, TokenException> {

    const jwtVerifyResult = await this.tokenProvider.verify<UserProfile>(token)

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
