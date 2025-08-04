import { Exception } from "lib/utils/Exception";

export type Result<T, E extends Exception> = {
  orElseThrow: () => T
  orElseNull: () => T | null
} & ({
  value: T
  failure: false
  success: true
} | {
  error: E
  failure: true
  success: false
})

export type AsyncResult<T, E extends Exception> = Promise<Result<T, E>>

export const Ok = <T>(value: T): Result<T, never> => ({
  value,
  orElseThrow: () => value,
  orElseNull: () => value,
  failure: false,
  success: true
});

export const Err = <E extends Exception>(error: E): Result<never, E> => ({
  error,
  orElseThrow: () => { throw error },
  orElseNull: () => null,
  failure: true,
  success: false
});

export async function tryAsync<T>(promise: () => Promise<T>): AsyncResult<T, Exception> {
  try {
    const value = await promise();
    return Ok(value)
  } catch (err) {
    if (err instanceof Exception) return Err(err)
    return Err(new Exception({
      message: 'Unexpected internal error',
      type: 'UNEXPECTED_ERROR'
    }))
  }
}

export function trySync<T>(fn: () => T): Result<T, Exception> {
  try {
    const value = fn();
    return Ok(value)
  } catch (err) {
    if (err! instanceof Exception) {
      return Err(new Exception({
        message: 'Unexpected internal error',
        type: 'UNEXPECTED_ERROR'
      }))
    }
    return Err(err)
  }
}

(globalThis as any).Ok = Ok;
(globalThis as any).Err = Err;
(globalThis as any).tryAsync = tryAsync;
