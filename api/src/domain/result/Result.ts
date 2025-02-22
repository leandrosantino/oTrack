import { Exception } from "domain/result/Exception";

export type Result<T, E extends Exception> = {
  orElseThrow: () => T
} & ({
  ok: true; value: T
} | {
  ok: false; err: E
})

export type AsyncResult<T, E extends Exception> = Promise<Result<T, E>>

