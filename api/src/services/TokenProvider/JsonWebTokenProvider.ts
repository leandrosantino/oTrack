import { inject, injectable } from "tsyringe";
import { Properties } from "utils/Properties";
import { ITokenProvider } from "./ITokenProvider";
import { TokenException } from "../../entities/user/exceptions/TokenException";
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'

@injectable()
export class JsonWebTokenProvider implements ITokenProvider {

  constructor(
    @inject('Properties') private readonly properties: Properties,
  ) { }

  generateAccessToken(payload: object): string {
    return jwt.sign(Object.assign({}, payload), this.properties.env.JWT_SECRET, {
      expiresIn: this.properties.env.ACCESS_TOKEN_EXPIRES
    })
  }

  generateRefreshToken(payload: object): string {
    return jwt.sign(Object.assign({}, payload), this.properties.env.JWT_SECRET, {
      expiresIn: this.properties.env.REFRESH_TOKEN_EXPIRES
    })
  }

  async verify<T>(token: string): AsyncResult<T, TokenException> {
    const { err, data } = await new Promise<{ err: any, data: any }>(resolve => {
      jwt.verify(token, this.properties.env.JWT_SECRET, (err, data) => resolve({ err, data }))
    })

    if (err instanceof TokenExpiredError) return Err(new TokenException.ExpiredToken())
    if (err instanceof JsonWebTokenError) return Err(new TokenException.InvalidToken())

    return Ok(data)
  }

  async decode<T>(token: string): AsyncResult<T, TokenException> {
    const decoded = jwt.decode(token)
    if (!decoded) {
      return Err(new TokenException.InvalidToken())
    }
    return Ok(decoded as T)
  }

}
