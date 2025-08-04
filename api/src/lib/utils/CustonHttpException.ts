import { HttpException, HttpStatus } from "@nestjs/common";
import { Exception } from "./Exception";

export class CustonHttpException extends HttpException {
  constructor(exception: Exception, code: HttpStatus) {
    super(
      exception.details(),
      code
    )
  }
}
