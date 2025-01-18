import z from "zod";

export function ERROR_SCHEMA(errorType: string) {
  return z.object({
    message: z.string(),
    type: z.string().default(errorType)
  })
}
