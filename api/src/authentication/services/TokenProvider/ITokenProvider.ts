import { TokenException } from "authentication/exceptions/TokenException"

export interface ITokenProvider {

  generateAccessToken(payload: object): string
  generateRefreshToken(payload: object): string
  verify<T>(token: string): AsyncResult<T, TokenException>
  decode<T>(token: string): AsyncResult<T, TokenException>

}
