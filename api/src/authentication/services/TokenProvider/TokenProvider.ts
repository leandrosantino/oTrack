import { Exception } from "lib/utils/Exception"

export interface TokenProvider {

  generateAccessToken(payload: object): string
  generateRefreshToken(payload: object): string
  verify<T>(token: string): AsyncResult<T, InvalidTokenException | ExpiredTokenException | AlreadyUsedToken>
  decode<T>(token: string): AsyncResult<T, InvalidTokenException | ExpiredTokenException | AlreadyUsedToken>

}

export class InvalidTokenException extends Exception {
  constructor() {
    super({
      message: "Invalid token",
      type: "INVALID_TOKEN",
    });
  }
};

export class ExpiredTokenException extends Exception {
  constructor() {
    super({
      message: "Expired token",
      type: "EXPIRED_TOKEN",
    });
  }
};

export class AlreadyUsedToken extends Exception {
  constructor() {
    super({
      message: "Already used token",
      type: "ALREADY_USED_TOKEN",
    });
  }
};
