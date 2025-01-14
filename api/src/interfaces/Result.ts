
import { UserExceptions } from 'entities/user/UserExceptions';
import { SignInExceptions, TokenExceptions } from 'services/AuthService/AuthExceptions';

export type ErrorTypes =
  UserExceptions |
  SignInExceptions |
  TokenExceptions

export interface IErrorHandler<T> {
  type: T
  case(type: T, callback: () => void): IErrorHandler<T>
  throw(message: string): {
    type: T,
    message: string
  }
}

export type Result<T, E extends ErrorTypes> = {
  ok: true; value: T
} | {
  ok: false; err: IErrorHandler<E>
}

export type AsyncResult<T, E extends ErrorTypes> = Promise<Result<T, E>>

