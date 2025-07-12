import { GoogleTokenInfo } from "authentication/DTOs";
import { SignInException } from "authentication/exceptions/SignInException";
import { IGoogleAuth } from "./IGoogleAuth";
import { inject, singleton } from "tsyringe";
import { HttpClient } from "../HttpClient/HttpCLient";
import { GoogleAuthException } from "./GoogleAuthExceptions";

@singleton()
export class GoogleAuth implements IGoogleAuth {

  GOOGLE_AUTH_URL = 'https://oauth2.googleapis.com/tokeninfo'

  constructor(
    @inject('HttpClient') private readonly httpClient: HttpClient
  ) { }

  async getUserInfo(idToken: string): AsyncResult<GoogleTokenInfo, GoogleAuthException> {

    const apiResult = await this.httpClient.get<GoogleTokenInfo, { error: string }>(`${this.GOOGLE_AUTH_URL}?id_token=${idToken}`)

    if (!apiResult.ok) {
      if (apiResult.err.data.error === 'invalid_token') {
        return Err(new GoogleAuthException.InvalidGoogleToken())
      }
      return Err(new GoogleAuthException.GoogleAuthError())
    }

    return Ok(apiResult.value)

  }

}
