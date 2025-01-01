import { container, inject, injectable, singleton } from "tsyringe";
import { IAuthService } from "./IAuthService";
import { AuthRequestDTO, JwtToken, TokenData } from "./IAuthServiceDTO";
import jwt, { type SignOptions, type VerifyOptions } from 'jsonwebtoken'
import { Properties } from "config/Properties";

@injectable()
export class AuthService implements IAuthService {

  constructor(
    @inject('Properties') private readonly properties: Properties
  ) { }

  signIn({ username, password }: AuthRequestDTO) {
    console.log('signIn')

    const tokenData: TokenData = {
      uid: '',
      username: 'leandro',
      permissions: ['ADMIN']
    }

    const token = jwt.sign(tokenData, this.properties.env.JWT_SECRET, {
      expiresIn: this.properties.env.TOKEN_EXPIRES
    })

    return token
  }

  verifiyToken(token: JwtToken): TokenData {
    throw new Error("Method not implemented.");
  }

}
