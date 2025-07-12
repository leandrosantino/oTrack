import { GoogleTokenInfo } from "authentication/DTOs";
import { GoogleAuthException } from "./GoogleAuthExceptions";

export interface IGoogleAuth {
  getUserInfo(token: string): AsyncResult<GoogleTokenInfo, GoogleAuthException>;
}
