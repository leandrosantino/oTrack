import { HttpException, HttpStatus } from "@nestjs/common";
import { Exception } from "./Exception";

export class CustonHttpException<T extends Exception> extends HttpException {
  constructor(ExceptionClass: new (...args: any[]) => T, code: HttpStatus) {
    const exception = new ExceptionClass()
    super(
      exception.details(),
      code
    )
  }
}
