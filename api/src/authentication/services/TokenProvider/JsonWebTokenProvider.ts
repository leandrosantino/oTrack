import jwt from 'jsonwebtoken'
import { ExpiredTokenException, InvalidTokenException, TokenProvider } from "./TokenProvider";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JsonWebTokenProvider implements TokenProvider {

  constructor() { }

  generateAccessToken(payload: object): string {
    return jwt.sign(Object.assign({}, payload), properties.JWT_SECRET, {
      expiresIn: properties.ACCESS_TOKEN_EXPIRES
    })
  }

  generateRefreshToken(payload: object): string {
    return jwt.sign(Object.assign({}, payload), properties.JWT_SECRET, {
      expiresIn: properties.REFRESH_TOKEN_EXPIRES
    })
  }

  async verify<T>(token: string): AsyncResult<T, InvalidTokenException | ExpiredTokenException> {
    const { err, data } = await new Promise<{ err: any, data: any }>(resolve => {
      jwt.verify(token, properties.JWT_SECRET, (err, data) => resolve({ err, data }))
    })

    if (err instanceof jwt.TokenExpiredError) return Err(new ExpiredTokenException())
    if (err instanceof jwt.JsonWebTokenError) return Err(new InvalidTokenException())

    return Ok(data)
  }

  async decode<T>(token: string): AsyncResult<T, InvalidTokenException> {
    const decoded = jwt.decode(token)
    if (!decoded) {
      return Err(new InvalidTokenException())
    }
    return Ok(decoded as T)
  }

}
