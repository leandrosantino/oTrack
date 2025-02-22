import { singleton } from "tsyringe";
import z from "zod";
import { Validator } from "application/validation/Validator";
import { ValidationException } from "application/validation/ValidatorException";
import { Roules } from "domain/entities/user/Roule";
import { UserProfile } from "domain/entities/user/UserProfile";

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
