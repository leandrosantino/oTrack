import { Exception } from "../utils/Exception"

export const Ok = <T>(value: T): Result<T, never> => ({
  ok: true,
  value,
  orElseThrow() { return value },
  orElseNull() { return value }
});

export const Err = <E extends Exception>(error: E): Result<never, E> => ({
  ok: false,
  err: error,
  orElseThrow() { throw error },
  orElseNull() { return null }
});
