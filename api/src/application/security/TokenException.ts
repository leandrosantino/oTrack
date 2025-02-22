import { Exception } from "domain/result/Exception";

export class TokenException extends Exception {

  static InvalidToken = class extends TokenException {
    constructor() {
      super({
        message: "Invalid token",
        type: "INVALID_TOKEN",
      });
    }
  };

  static ExpiredToken = class extends TokenException {
    constructor() {
      super({
        message: "Expired token",
        type: "EXPIRED_TOKEN",
      });
    }
  };

}
