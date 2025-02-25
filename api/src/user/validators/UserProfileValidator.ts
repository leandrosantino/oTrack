import { singleton } from "tsyringe";
import z from "zod";
import { Roules } from "../Roule";
import { Validator } from "shared/Validator/Validator";
import { ValidationException } from "shared/Validator/ValidatorException";
import { UserProfile } from "user/UserProfile";

@singleton()
export class UserProfileValidator implements Validator<UserProfile> {

  static SCHEMA = z.object({
    id: z.number(),
    username: z.string(),
    displayName: z.string(),
    roule: z.nativeEnum(Roules),
  })

  parse(data: UserProfile): Result<UserProfile, ValidationException> {
    const { success, data: tokenData } = UserProfileValidator.SCHEMA.safeParse(data)
    if (!success) {
      return Err(new ValidationException.InvalidData())
    }
    return Ok(tokenData)
  }

}
