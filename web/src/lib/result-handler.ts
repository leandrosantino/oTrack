import { IErrorHandler } from "@/domain/interfaces/Result";

class ErrorHandle<T> implements IErrorHandler<T> {
  type: string
  data: T

  constructor(type: string, data: T) {
    this.type = type
    this.data = data
  }

  case(type: string, callback: VoidFunction) {
    if (this.type === type) {
      callback()
    }
    return this
  }
}

export const Ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const Err = <E>(type: string, error: E): Result<never, E> => ({ ok: false, err: new ErrorHandle<E>(type, error) });
