
class ErrorHandle<T> {
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

export type Result<T, E> = {
  isSuccess: true; value: T
} | {
  isSuccess: false; error: ErrorHandle<E>
}

export const Ok = <T>(value: T): Result<T, never> => ({ isSuccess: true, value });
export const Err = <E>(error: E): Result<never, E> => ({ isSuccess: false, error: new ErrorHandle<E>(error) });
