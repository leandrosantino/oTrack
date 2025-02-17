import { singleton } from "tsyringe";
import { IWebSocketAuthService, TicketData } from "./IWebSocketAuthService";
import { TokenExceptions } from "services/JwtService/TokenExceptions";
import { createId } from '@paralleldrive/cuid2';
import { TicketExceptions } from "./TicketExceptions";

@singleton()
export class WebSocketAuthService implements IWebSocketAuthService {

  private tickets = new Map<string, TicketData>()

  async generateTicket(ticketData: TicketData): Promise<string> {
    const ticket = createId()
    this.tickets.set(ticket, ticketData)
    return ticket
  }

  async verifyTicket(ticket: string): AsyncResult<TicketData, TicketExceptions> {
    const ticketData = this.tickets.get(ticket)
    if (!ticketData) {
      return Err(TicketExceptions.INVALID_TICKET)
    }
    this.tickets.delete(ticket)
    return Ok(ticketData)
  }

}
