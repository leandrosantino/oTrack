import { Exception } from "domain/result/Exception";


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
