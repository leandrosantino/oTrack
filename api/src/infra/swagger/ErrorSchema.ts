import { Exception } from "domain/result/Exception";
import z from "zod";

export function ERROR_SCHEMA<T extends Exception>(ExceptionClass: new (...args: any[]) => T) {
  const exception = new ExceptionClass()
  return z.object({
    message: z.string().default(exception.message),
    type: z.string().default(exception.type)
  }).describe(exception.message)
}
