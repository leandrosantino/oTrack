import { Exception } from "utils/Exception";

export interface Validator<T> {
  parse(data: T): Result<T, ValidationException>;
}

export class ValidationException extends Exception {

  static readonly InvalidData = class extends ValidationException {
    constructor() {
      super({
        message: 'Invalid data',
        type: 'INVALID_DATA'
      })
    }
  }

}
