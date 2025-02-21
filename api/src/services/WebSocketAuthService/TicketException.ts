import { Exception } from "utils/Exception";

export class TicketException extends Exception {

  static InvalidTicket = class extends TicketException {
    constructor() {
      super({
        message: 'Invalid ticket',
        type: 'INVALID_TICKET'
      })
    }
  }

}
