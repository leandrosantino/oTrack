import { Exception } from "shared/utils/Exception";

export class CreateUserException extends Exception {

  static UserAlreadyExists = class extends CreateUserException {
    constructor() {
      super({
        message: "User already exists",
        type: "USER_ALREADY_EXISTS",
      });
    }
  };
}
