import { inject, singleton } from "tsyringe";
import { AuthResponseDTO, GoogleTokenInfo, SignInWithGoogleRequestDTO } from "authentication/DTOs";
import { SignInException } from "authentication/exceptions/SignInException";
import { IUserRepository } from "user/IUserRepository";
import { ITokenProvider } from "authentication/services/TokenProvider/ITokenProvider";
import { UserProfile } from "user/UserProfile";
import { IGoogleAuth } from "authentication/services/GoogleAuth/IGoogleAuth";
import { GoogleAuthException } from "authentication/services/GoogleAuth/GoogleAuthExceptions";

@singleton()
export class SignInWithGoogle {

  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('TokenProvider') private readonly tokenProvider: ITokenProvider,
    @inject('GoogleAuth') private readonly googleAuth: IGoogleAuth,
  ) { }

  async execute({ idToken }: SignInWithGoogleRequestDTO): AsyncResult<AuthResponseDTO, SignInException | GoogleAuthException> {

    const apiResult = await this.googleAuth.getUserInfo(idToken)

    if (!apiResult.ok) {
      return Err(apiResult.err)
    }
    const { email } = apiResult.value

    const user = await this.userRepository.getByEmail(email)

    if (!user) {
      return Err(new SignInException.UserNotFound())
    }

    const createdToken = await this.userRepository.createToken(user.id)

    const accessToken = this.tokenProvider.generateAccessToken(new UserProfile(user))
    const refreshToken = this.tokenProvider.generateRefreshToken(createdToken)

    return Ok({ accessToken, refreshToken })
  }

}
