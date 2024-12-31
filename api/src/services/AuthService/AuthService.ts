import { container, injectable, singleton } from "tsyringe";
import { IAuthService } from "./IAuthService";
import { AuthRequestDTO, JwtToken, TokenData } from "./IAuthServiceDTO";
import jwt, { type SignOptions, type VerifyOptions } from 'jsonwebtoken'

@injectable()
export class AuthService implements IAuthService {

  private readonly secret = '0d05310c-3bcb-48b8-bd7d-b0feef9769f6'
  private readonly toeknExpires = '1 days'

  signIn({ username, password }: AuthRequestDTO) {
    console.log('signIn')

    const tokenData: TokenData = {
      uid: '',
      username: 'leandro',
      permissions: ['ADMIN']
    }

    const token = jwt.sign(tokenData, this.secret, {
      expiresIn: this.toeknExpires
    })

    return token
  }

  verifiyToken(token: JwtToken): TokenData {
    throw new Error("Method not implemented.");
  }

}
