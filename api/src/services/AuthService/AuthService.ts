import { inject, injectable } from "tsyringe";
import { IAuthService } from "./IAuthService";
import { AuthRequestDTO, JwtToken, TokenData } from "./IAuthServiceDTO";
import jwt from 'jsonwebtoken'
import { Properties } from "config/Properties";
import { IUserRepository } from 'entities/user/IUserRepository'
import { Roules } from "entities/user/Roule";
import { ErrorMessage } from "entities/types/ErrorMessage";

@injectable()
export class AuthService implements IAuthService {

  constructor(
    @inject('Properties') private readonly properties: Properties,
    @inject('UserRepository') private readonly userRepository: IUserRepository
  ) { }

  async signIn({ username, password }: AuthRequestDTO) {

    const user = await this.userRepository.getByUsername(username)

    if (!user) {
      throw new Error('User not found', { cause: ErrorMessage.NOT_FOUND })
    }

    if (!user) {
      throw new Error('User not found', { cause: ErrorMessage.NOT_FOUND })
    }

    const tokenData: TokenData = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      roule: user.roule
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
          reject(new Error('Invalid token', { cause: ErrorMessage.VALIDATION_ERROR }))
          return
        }
        resolve(data as TokenData)
      })
    })
  }

}
