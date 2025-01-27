import { TokenExceptions } from "./TokenExceptions"

export interface IJwtService {

  generateAccessToken(payload: object): string
  generateRefreshToken(payload: object): string
  verify<T>(token: string): AsyncResult<T, TokenExceptions>
  decode<T>(token: string): AsyncResult<T, TokenExceptions>

}
