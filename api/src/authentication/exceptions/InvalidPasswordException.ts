import { Exception } from "lib/utils/Exception";

export class InvalidPasswordException extends Exception {
  constructor() {
    super({
      message: "Invalid password",
      type: "INVALID_PASSWORD",
    });
  }
};
