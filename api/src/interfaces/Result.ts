import { Exception } from "utils/Exception";

export type Result<T, E extends Exception> = {
  orElseThrow: () => T
  orElseNull: () => T | null
} & ({
  ok: true; value: T
} | {
  ok: false; err: E
})

export type AsyncResult<T, E extends Exception> = Promise<Result<T, E>>

