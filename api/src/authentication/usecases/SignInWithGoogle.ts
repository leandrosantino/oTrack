import { UserRepository } from "user/repository/UserRepository";
import { TokenProvider } from "authentication/services/TokenProvider/TokenProvider";
import { UserProfile } from "user/dto/UserProfile";
import { IGoogleAuth } from "authentication/services/GoogleAuth/IGoogleAuth";
import { TokenPair } from "authentication/dto/TokenPair";
import { Inject, Injectable } from "@nestjs/common";
import { UserNotFoundException } from "authentication/exceptions/UserNotFoundException";

@Injectable()
export class SignInWithGoogle {

  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('TokenProvider') private readonly tokenProvider: TokenProvider,
    @Inject('GoogleAuth') private readonly googleAuth: IGoogleAuth,
  ) { }

  async execute({ idToken }: { idToken: string }): Promise<TokenPair> {

    const { email } = await this.googleAuth.getUserInfo(idToken)

    const user = await this.userRepository.getByEmail(email)

    if (!user) {
      throw new UserNotFoundException()
    }

    const createdToken = await this.userRepository.createToken(user.id)

    const accessToken = this.tokenProvider.generateAccessToken(new UserProfile(user))
    const refreshToken = this.tokenProvider.generateRefreshToken(createdToken)

    return { accessToken, refreshToken }
  }

}
