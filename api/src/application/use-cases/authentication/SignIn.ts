import { PasswordHasher } from "application/security/PasswordHasher";
import { singleton, inject } from "tsyringe";
import { AuthRequestDTO, AuthResponseDTO } from "./types";
import { TokenProvider } from "application/security/TokenProvider";
import { SignInException } from "domain/entities/user/exceptions/SignInException";
import { IUserRepository } from "domain/entities/user/IUserRepository";
import { UserProfile } from "domain/entities/user/UserProfile";


@singleton()
export class SignIn {

  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('PasswordHasher') private readonly passwordHasher: PasswordHasher,
    @inject('JwtService') private readonly jwtService: TokenProvider
  ) { }


  async execute({ username, password }: AuthRequestDTO): AsyncResult<AuthResponseDTO, SignInException> {
    const user = await this.userRepository.getByUsername(username)

    if (!user) {
      return Err(new SignInException.UserNotFound())
    }

    if (!(await this.passwordHasher.verify(password, user.password))) {
      return Err(new SignInException.UserNotFound())
    }

    const createdToken = await this.userRepository.createToken(user.id)

    const accessToken = this.jwtService.generateAccessToken(new UserProfile(user))
    const refreshToken = this.jwtService.generateRefreshToken(createdToken)

    return Ok({ accessToken, refreshToken })
  }
}
