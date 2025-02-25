import { SignInException } from "entities/user/exceptions/SignInException";
import { inject, singleton } from "tsyringe";
import { AuthRequestDTO, AuthResponseDTO } from "./DTOs";
import { IUserRepository } from "entities/user/IUserRepository";
import { UserProfile } from "entities/user/UserProfile";
import { ITokenProvider } from "services/TokenProvider/ITokenProvider";
import { IPasswordHasher } from "services/PasswordHasher/IPasswordHasher";


@singleton()
export class SignIn {

  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('PasswordHasher') private readonly passwordHasher: IPasswordHasher,
    @inject('TokenProvider') private readonly tokenProvider: ITokenProvider
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

    const accessToken = this.tokenProvider.generateAccessToken(new UserProfile(user))
    const refreshToken = this.tokenProvider.generateRefreshToken(createdToken)

    return Ok({ accessToken, refreshToken })
  }
}
