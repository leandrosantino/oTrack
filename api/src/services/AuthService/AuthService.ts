import { inject, injectable } from "tsyringe";
import { IAuthService } from "./IAuthService";
import { AuthRequestDTO, JwtToken, TokenData } from "./IAuthServiceDTO";
import jwt from 'jsonwebtoken'
import { IUserRepository } from 'entities/user/IUserRepository'
import { SignInExceptions, TokenExceptions } from "./AuthExceptions";
import { Properties } from "utils/Properties";


@injectable()
export class AuthService implements IAuthService {

  constructor(
    @inject('Properties') private readonly properties: Properties,
    @inject('UserRepository') private readonly userRepository: IUserRepository
  ) { }

  async signIn({ username, password }: AuthRequestDTO): AsyncResult<JwtToken, SignInExceptions> {
    const user = await this.userRepository.getByUsername(username)

    if (!user) {
      return Err(SignInExceptions.USER_NOT_FOUND)
    }

    if (user.password != password) {
      return Err(SignInExceptions.INVALID_PASSWORD)
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

    return Ok(token)
  }

  async verifyToken(token: JwtToken): AsyncResult<TokenData, TokenExceptions> {
    const { err, data } = await new Promise<{ err: Error | null, data: any }>(resolve => {
      jwt.verify(token, this.properties.env.JWT_SECRET, (err, data) => resolve({ err, data }))
    })

    if (err != null) {
      return Err(TokenExceptions.INVALID_TOKEN)
    }

    return Ok(data as TokenData)
  }


}
