import { Exception } from "lib/utils/Exception";

export class UserAlreadyExists extends Exception {
  constructor() {
    super({
      message: "User already exists",
      type: "USER_ALREADY_EXISTS",
    });
  }
};
