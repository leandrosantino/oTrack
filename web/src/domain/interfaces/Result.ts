export interface IErrorHandler<T> {
  type: string
  data: T
  case(type: string, callback: VoidFunction): IErrorHandler<T>
}

export type Result<T, E> = {
  ok: true; value: T
} | {
  ok: false; err: E
}

export type AsyncResult<T, E> = Promise<Result<T, E>>

