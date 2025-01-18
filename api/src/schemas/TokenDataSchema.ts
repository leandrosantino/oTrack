import z from "zod";

export const TOKEN_DATA_SCHEMA = z.object({
  id: z.number(),
  username: z.string(),
  displayName: z.string(),
  roule: z.string(),
})
