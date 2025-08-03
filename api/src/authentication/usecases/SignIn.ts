import { PasswordHasher } from "shared/services/PasswordHasher/PasswordHasher";
import { TokenProvider } from "authentication/services/TokenProvider/TokenProvider";
import { UserRepository } from "user/repository/UserRepository";
import { UserProfile } from "user/dto/UserProfile";
import { Inject, Injectable } from "@nestjs/common";
import { SignInResquestDto } from "authentication/dto/SignInResquestDto";
import { TokenPair } from "authentication/dto/TokenPair";
import { InvalidPasswordException } from "authentication/exceptions/InvalidPasswordException";
import { UserNotFoundException } from "authentication/exceptions/UserNotFoundException";


@Injectable()
export class SignIn {

  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('PasswordHasher') private readonly passwordHasher: PasswordHasher,
    @Inject('TokenProvider') private readonly tokenProvider: TokenProvider
  ) { }


  async execute({ email, password }: SignInResquestDto): Promise<TokenPair> {
    const user = await this.userRepository.getByEmail(email)

    if (!user) {
      throw new UserNotFoundException()
    }

    if (!(await this.passwordHasher.verify(password, user.password))) {
      throw new InvalidPasswordException()
    }

    const createdToken = await this.userRepository.createToken(user.id)

    const accessToken = this.tokenProvider.generateAccessToken(new UserProfile(user))
    const refreshToken = this.tokenProvider.generateRefreshToken(createdToken)

    return { accessToken, refreshToken }
  }
}
