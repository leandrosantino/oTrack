import { Roules } from "entities/user/Roule";
import z from "zod";

export const USER_PROFILE_SCHEMA = z.object({
  id: z.number(),
  username: z.string(),
  displayName: z.string(),
  roule: z.nativeEnum(Roules),
})
