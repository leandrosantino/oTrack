import { UserProfile } from "entities/user/UserProfile";
import { ValidationException, Validator } from "interfaces/Validator";
import { USER_PROFILE_SCHEMA } from "schemas/UserProfileSchema";
import { singleton } from "tsyringe";

@singleton()
export class UserProfileValidator implements Validator<UserProfile> {
  parse(data: UserProfile): Result<UserProfile, ValidationException> {
    const { success, data: tokenData } = USER_PROFILE_SCHEMA.safeParse(data)
    if (!success) {
      return Err(new ValidationException.InvalidData())
    }
    return Ok(tokenData)
  }

}
