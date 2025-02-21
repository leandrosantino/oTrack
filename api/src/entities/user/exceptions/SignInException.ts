import { Exception } from "utils/Exception";

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

}
