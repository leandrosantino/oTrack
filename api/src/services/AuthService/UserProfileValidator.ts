import { ValidationExceptions, Validator } from "interfaces/Validator";
import { UserProfile } from "./IAuthService";
import { USER_PROFILE_SCHEMA } from "schemas/UserProfileSchema";
import { singleton } from "tsyringe";

@singleton()
export class UserProfileValidator implements Validator<UserProfile> {
  parse(data: UserProfile): Result<UserProfile, ValidationExceptions> {
    const { success, data: tokenData } = USER_PROFILE_SCHEMA.safeParse(data)
    if (!success) {
      return Err(ValidationExceptions.INVALID_DATA)
    }
    return Ok(tokenData)
  }

}
