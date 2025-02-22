import { Exception } from "domain/result/Exception";

export class WebSocketAuthException extends Exception {

  static InvalidTicket = class extends WebSocketAuthException {
    constructor() {
      super({
        message: 'Invalid ticket',
        type: 'INVALID_TICKET'
      })
    }
  }

}
