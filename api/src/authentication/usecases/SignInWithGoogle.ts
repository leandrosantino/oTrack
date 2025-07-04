import { inject, singleton } from "tsyringe";
import { SignIn } from "./SignIn";
import { HttpClient } from "authentication/services/HttpClient/HttpCLient";
import { AuthResponseDTO, GoogleTokenInfo, SignInWithGoogleRequestDTO } from "authentication/DTOs";
import { SignInException } from "authentication/exceptions/SignInException";
import { IUserRepository } from "user/IUserRepository";
import { ITokenProvider } from "authentication/services/TokenProvider/ITokenProvider";
import { UserProfile } from "user/UserProfile";

@singleton()
export class SignInWithGoogle {

  GOOGLE_AUTH_URL = 'https://oauth2.googleapis.com/tokeninfo'

  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('TokenProvider') private readonly tokenProvider: ITokenProvider,
    @inject('HttpClient') private readonly httpClient: HttpClient
  ) { }

  async execute({ idToken }: SignInWithGoogleRequestDTO): AsyncResult<AuthResponseDTO, SignInException> {

    const apiResult = await this.httpClient.get<GoogleTokenInfo, { error: string }>(`${this.GOOGLE_AUTH_URL}?id_token=${idToken}`)

    if (!apiResult.ok) {
      return Err(new SignInException.InvalidGoogleToken())
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
