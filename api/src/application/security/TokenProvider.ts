import { TokenException } from "./TokenException"

export interface TokenProvider {

  generateAccessToken(payload: object): string
  generateRefreshToken(payload: object): string
  verify<T>(token: string): AsyncResult<T, TokenException>
  decode<T>(token: string): AsyncResult<T, TokenException>

}
