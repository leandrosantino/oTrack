import { Exception } from "utils/Exception";
import z from "zod";

export function ERROR_SCHEMA(exception: Exception) {
  return z.object({
    message: z.string().default(exception.message),
    type: z.string().default(exception.message)
  }).describe(exception.message)
}
