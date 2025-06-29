import { singleton } from "tsyringe";
import z from "zod";
import { Role } from "../Role";
import { Validator } from "shared/Validator/Validator";
import { ValidationException } from "shared/Validator/ValidatorException";
import { UserProfile } from "user/UserProfile";

@singleton()
export class UserProfileValidator implements Validator<UserProfile> {

  static SCHEMA = z.object({
    id: z.number(),
    email: z.string().email(),
    displayName: z.string(),
    role: z.nativeEnum(Role),
    emailIsVerified: z.boolean(),
    profilePictureUrl: z.string().url().optional().nullable(),
  })

  parse(data: UserProfile): Result<UserProfile, ValidationException> {
    const { success, data: tokenData } = UserProfileValidator.SCHEMA.safeParse(data)
    if (!success) {
      return Err(new ValidationException.InvalidData())
    }
    return Ok(tokenData)
  }

}
