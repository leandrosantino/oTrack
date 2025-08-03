import { GoogleAuthError, IGoogleAuth, InvalidGoogleToken } from "./IGoogleAuth";
import { HttpClient } from "../../../shared/services/HttpClient/HttpCLient";
import { GoogleTokenInfo } from "authentication/dto/GoogleTokenInfo";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GoogleAuth implements IGoogleAuth {

  GOOGLE_AUTH_URL = 'https://oauth2.googleapis.com/tokeninfo'

  constructor(
    @Inject('HttpClient') private readonly httpClient: HttpClient
  ) { }

  async getUserInfo(idToken: string): Promise<GoogleTokenInfo> {

    const apiResult = await this.httpClient.get<GoogleTokenInfo, { error: string }>(`${this.GOOGLE_AUTH_URL}?id_token=${idToken}`)

    if (apiResult.failure) {
      if (apiResult.error.data.error === 'invalid_token') {
        throw new InvalidGoogleToken()
      }
      throw new GoogleAuthError()
    }

    return apiResult.value

  }

}
