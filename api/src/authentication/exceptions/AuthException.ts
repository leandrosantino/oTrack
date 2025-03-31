import { Exception } from "shared/utils/Exception";

export class AuthException extends Exception {

  static Unauthticated = class extends AuthException {
    constructor() {
      super({
        message: "You are not authenticated",
        type: "UNAUTHENTICATED",
      });
    }
  };

  static Unauthorized = class extends AuthException {
    constructor() {
      super({
        message: "You not have permission to access this resource",
        type: "UNAUTHORIZED",
      });
    }
  };

}
