import { GoogleTokenInfo } from "authentication/dto/GoogleTokenInfo";
import { Exception } from "lib/utils/Exception";

export interface IGoogleAuth {
  getUserInfo(token: string): Promise<GoogleTokenInfo>;
}


export class InvalidGoogleToken extends Exception {
  constructor() {
    super({
      message: "Invalid google token",
      type: "INVALID_GOOGLE_TOKEN",
    });
  }
};

export class GoogleAuthError extends Exception {
  constructor() {
    super({
      message: "Unexpected error from google auth",
      type: "UNEXPECTED_GOOGLE_ERROR",
    });
  }
};
