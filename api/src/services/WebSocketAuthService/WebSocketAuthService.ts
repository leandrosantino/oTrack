import { singleton } from "tsyringe";
import { IWebSocketAuthService, TicketData } from "./IWebSocketAuthService";
import { createId } from '@paralleldrive/cuid2';
import { TicketException } from "./TicketException";

@singleton()
export class WebSocketAuthService implements IWebSocketAuthService {

  private tickets = new Map<string, TicketData>()

  async generateTicket(ticketData: TicketData): Promise<string> {
    const ticket = createId()
    this.tickets.set(ticket, ticketData)
    return ticket
  }

  async verifyTicket(ticket: string): AsyncResult<TicketData, TicketException> {
    const ticketData = this.tickets.get(ticket)
    if (!ticketData) {
      return Err(new TicketException.InvalidTicket())
    }
    this.tickets.delete(ticket)
    return Ok(ticketData)
  }

}
