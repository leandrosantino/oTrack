import { IErrorHandler, ErrorTypes } from "interfaces/Result"

class ErrorHandle<T> implements IErrorHandler<T> {
  type: T

  constructor(type: T) {
    this.type = type
  }

  case(type: T, callback: () => void) {
    if (this.type === type) {
      callback()
    }
    return this
  }

  throw(message: string) {
    return {
      type: this.type,
      message
    }
  }
}

export const Ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const Err = <E extends ErrorTypes>(error: E): Result<never, E> => ({ ok: false, err: new ErrorHandle<E>(error) });
