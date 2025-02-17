
import { UserExceptions } from 'entities/user/UserExceptions';
import { SignInExceptions } from 'services/AuthService/AuthExceptions';
import { TokenExceptions } from 'services/JwtService/TokenExceptions';
import { TicketExceptions } from 'services/WebSocketAuthService.ts/TicketExceptions';

export type ErrorTypes =
  UserExceptions |
  SignInExceptions |
  TokenExceptions |
  TicketExceptions

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

