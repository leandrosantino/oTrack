import { Exception } from "shared/utils/Exception";

export class ApplicationException extends Exception {

  static readonly InternalError = class extends ApplicationException {
    constructor() {
      super({
        message: 'Unexpected internal server error',
        type: 'INTERNAL_ERROR'
      })
    }
  }

}
