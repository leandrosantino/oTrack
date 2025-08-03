import { Exception } from "lib/utils/Exception";

export class UserNotFoundException extends Exception {
  constructor() {
    super({
      message: "User not found",
      type: "USER_NOT_FOUND",
    });
  }
};
