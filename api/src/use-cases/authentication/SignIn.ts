import { SignInException } from "entities/user/exceptions/SignInException";
import { inject, singleton } from "tsyringe";
import { AuthRequestDTO, AuthResponseDTO } from "./types";
import { IUserRepository } from "entities/user/IUserRepository";
import { UserProfile } from "entities/user/UserProfile";
import { IJwtService } from "services/JwtService/IJwtService";
import { IPasswordHasher } from "services/PasswordHasher/IPasswordHasher";


@singleton()
export class SignIn {

  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('PasswordHasher') private readonly passwordHasher: IPasswordHasher,
    @inject('JwtService') private readonly jwtService: IJwtService
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
