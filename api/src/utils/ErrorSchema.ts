import z from "zod";

export function ERROR_SCHEMA(enumtype: any) {
  return z.object({
    message: z.string(),
    type: z.nativeEnum(enumtype)
  })
}
