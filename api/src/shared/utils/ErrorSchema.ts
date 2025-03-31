import z from "zod";
import { Exception } from "./Exception";

export class ErrorSchema {

  static build<T extends Exception>(ExceptionClass: new (...args: any[]) => T) {
    const exception = new ExceptionClass()
    return z.object({
      message: z.string().default(exception.message),
      type: z.string().default(exception.type)
    }).describe(exception.message)
  }

}
