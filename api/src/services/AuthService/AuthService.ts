import { container, inject, injectable, singleton } from "tsyringe";
import { IAuthService } from "./IAuthService";
import { AuthRequestDTO, JwtToken, TokenData } from "./IAuthServiceDTO";
import jwt from 'jsonwebtoken'
import { Properties } from "config/Properties";

@injectable()
export class AuthService implements IAuthService {

  constructor(
    @inject('Properties') private readonly properties: Properties
  ) { }

  signIn({ username, password }: AuthRequestDTO) {
    const tokenData: TokenData = {
      uid: '123456789',
      username: 'leandro',
      role: 'ADMIN'
    }

    const token = jwt.sign(tokenData, this.properties.env.JWT_SECRET, {
      expiresIn: this.properties.env.TOKEN_EXPIRES
    })

    return token
  }

  async verifyToken(token: JwtToken): Promise<TokenData> {
    return await new Promise<TokenData>((resolve, reject) => {
      jwt.verify(token, this.properties.env.JWT_SECRET, (err, data) => {
        if (err !== null) {
          reject(new Error('invalid token'))
          return
        }
        resolve(data as TokenData)
      })
    })
  }

}
