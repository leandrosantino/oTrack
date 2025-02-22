import { singleton } from "tsyringe";
import { createId } from '@paralleldrive/cuid2';
import { WebSocketAuthException } from "./TicketException";
import { UserProfile } from "domain/entities/user/UserProfile";

@singleton()
export class WebSocketAuthenticator {

  private tickets = new Map<string, UserProfile>()

  async generateTicket(ticketData: UserProfile): Promise<string> {
    const ticket = createId()
    this.tickets.set(ticket, ticketData)
    return ticket
  }

  async verifyTicket(ticket: string): AsyncResult<UserProfile, WebSocketAuthException> {
    const ticketData = this.tickets.get(ticket)
    if (!ticketData) {
      return Err(new WebSocketAuthException.InvalidTicket())
    }
    this.tickets.delete(ticket)
    return Ok(ticketData)
  }

}
