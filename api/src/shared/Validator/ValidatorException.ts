import { Exception } from "shared/utils/Exception"

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
