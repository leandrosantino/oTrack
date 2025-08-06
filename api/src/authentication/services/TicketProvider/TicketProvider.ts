import { Exception } from "lib/utils/Exception";

export interface TicketProvider {
  generate(payload: object, validityInMinutes: number): Promise<string>;
  use<T>(ticket: string): AsyncResult<T, InvalidTicket | ExpiredTicket>
  isValid(ticket: string): Promise<boolean>
}

export type TicketData<T = any> = { payload: T; expiresAt: Date }

export class InvalidTicket extends Exception {
  constructor() {
    super({
      message: 'Invalid ticket',
      type: 'INVALID_TICKET'
    })
  }
}

export class ExpiredTicket extends Exception {
  constructor() {
    super({
      message: 'Expired ticket',
      type: 'EXPIRED_TICKET'
    })
  }
}
