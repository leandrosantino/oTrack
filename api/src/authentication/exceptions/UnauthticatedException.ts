import { Exception } from "lib/utils/Exception";

export class UnauthticatedException extends Exception {
  constructor() {
    super({
      message: "You are not authenticated",
      type: "UNAUTHENTICATED",
    });
  }
};
