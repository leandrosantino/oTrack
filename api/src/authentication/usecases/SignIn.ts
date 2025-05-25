import { inject, singleton } from "tsyringe";
import { AuthRequestDTO, AuthResponseDTO } from "../DTOs";
import { SignInException } from "authentication/exceptions/SignInException";
import { IPasswordHasher } from "authentication/services/PasswordHasher/IPasswordHasher";
import { ITokenProvider } from "authentication/services/TokenProvider/ITokenProvider";
import { IUserRepository } from "user/IUserRepository";
import { UserProfile } from "user/UserProfile";


@singleton()
export class SignIn {

  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('PasswordHasher') private readonly passwordHasher: IPasswordHasher,
    @inject('TokenProvider') private readonly tokenProvider: ITokenProvider
  ) { }


  async execute({ username, password }: AuthRequestDTO): AsyncResult<AuthResponseDTO, SignInException> {
    const user = await this.userRepository.getByEmail(username)

    if (!user) {
      return Err(new SignInException.UserNotFound())
    }

    if (!(await this.passwordHasher.verify(password, user.password))) {
      return Err(new SignInException.InvalidPassword())
    }

    const createdToken = await this.userRepository.createToken(user.id)

    const accessToken = this.tokenProvider.generateAccessToken(new UserProfile(user))
    const refreshToken = this.tokenProvider.generateRefreshToken(createdToken)

    return Ok({ accessToken, refreshToken })
  }
}
