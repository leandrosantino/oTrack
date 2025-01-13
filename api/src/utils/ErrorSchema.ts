import { ErrorTypes } from "entities/types/ErrorTypes";
import z from "zod";

export const ERROR_SCHEMA = z.object({
  message: z.string(),
  type: z.nativeEnum(ErrorTypes)
})
