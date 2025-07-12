import { Exception } from "shared/utils/Exception";

export class GoogleAuthException extends Exception {

  static InvalidGoogleToken = class extends GoogleAuthException {
    constructor() {
      super({
        message: "Invalid google token",
        type: "INVALID_GOOGLE_TOKEN",
      });
    }
  };

  static GoogleAuthError = class extends GoogleAuthException {
    constructor() {
      super({
        message: "Unexpected error from google auth",
        type: "UNEXPECTED_GOOGLE_ERROR",
      });
    }
  };

}
