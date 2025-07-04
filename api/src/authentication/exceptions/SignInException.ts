import { Exception } from "shared/utils/Exception";

export class SignInException extends Exception {

  static UserNotFound = class extends SignInException {
    constructor() {
      super({
        message: "User not found",
        type: "USER_NOT_FOUND",
      });
    }
  };

  static InvalidPassword = class extends SignInException {
    constructor() {
      super({
        message: "Invalid password",
        type: "INVALID_PASSWORD",
      });
    }
  };

  static InvalidGoogleToken = class extends SignInException {
    constructor() {
      super({
        message: "Invalid google token",
        type: "INVALID_GOOGLE_TOKEN",
      });
    }
  };

}
