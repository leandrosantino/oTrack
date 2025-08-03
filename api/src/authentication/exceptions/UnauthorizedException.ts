import { Exception } from "lib/utils/Exception";

export class UnauthorizedException extends Exception {
  constructor() {
    super({
      message: "You not have permission to access this resource",
      type: "UNAUTHORIZED",
    });
  }
};
