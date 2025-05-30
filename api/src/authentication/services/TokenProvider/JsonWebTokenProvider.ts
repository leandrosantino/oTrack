import { inject, singleton } from "tsyringe";
import jwt from 'jsonwebtoken'
import { TokenException } from "authentication/exceptions/TokenException";
import { Properties } from "shared/utils/Properties";
import { ITokenProvider } from "./ITokenProvider";

@singleton()
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

    if (err instanceof jwt.TokenExpiredError) return Err(new TokenException.ExpiredToken())
    if (err instanceof jwt.JsonWebTokenError) return Err(new TokenException.InvalidToken())

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
