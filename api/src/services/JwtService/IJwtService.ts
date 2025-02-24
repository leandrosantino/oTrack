import { TokenException } from "../../entities/user/exceptions/TokenException"

export interface IJwtService {

  generateAccessToken(payload: object): string
  generateRefreshToken(payload: object): string
  verify<T>(token: string): AsyncResult<T, TokenException>
  decode<T>(token: string): AsyncResult<T, TokenException>

}
