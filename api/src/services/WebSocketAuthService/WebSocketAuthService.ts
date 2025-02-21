import { singleton } from "tsyringe";
import { IWebSocketAuthService } from "./IWebSocketAuthService";
import { createId } from '@paralleldrive/cuid2';
import { TicketException } from "./TicketException";
import { UserProfile } from "entities/user/UserProfile";

@singleton()
export class WebSocketAuthService implements IWebSocketAuthService {

  private tickets = new Map<string, UserProfile>()

  async generateTicket(ticketData: UserProfile): Promise<string> {
    const ticket = createId()
    this.tickets.set(ticket, ticketData)
    return ticket
  }

  async verifyTicket(ticket: string): AsyncResult<UserProfile, TicketException> {
    const ticketData = this.tickets.get(ticket)
    if (!ticketData) {
      return Err(new TicketException.InvalidTicket())
    }
    this.tickets.delete(ticket)
    return Ok(ticketData)
  }

}
