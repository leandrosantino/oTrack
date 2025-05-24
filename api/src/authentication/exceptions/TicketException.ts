import { Exception } from "shared/utils/Exception"

export class TicketException extends Exception {

  static InvalidTicket = class extends TicketException {
    constructor() {
      super({
        message: 'Invalid ticket',
        type: 'INVALID_TICKET'
      })
    }
  }

  static ExpiredTicket = class extends TicketException {
    constructor() {
      super({
        message: 'Expired ticket',
        type: 'EXPIRED_TICKET'
      })
    }
  }

}
