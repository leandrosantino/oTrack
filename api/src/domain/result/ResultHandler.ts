import { Exception } from "domain/result/Exception";

export const Ok = <T>(value: T): Result<T, never> => ({
  ok: true,
  value,
  orElseThrow() { return value }
});

export const Err = <E extends Exception>(error: E): Result<never, E> => ({
  ok: false,
  err: error,
  orElseThrow() { throw error },
});
