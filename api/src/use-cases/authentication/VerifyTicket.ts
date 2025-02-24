import { TicketException } from "entities/user/exceptions/TicketException"
import { UserProfile } from "entities/user/UserProfile"
import { singleton, inject } from "tsyringe"

@singleton()
export class VerifyTicket {

  constructor(
    @inject('TicketsMap') private readonly tickets: Map<string, UserProfile>
  ) { }

  async execute(ticket: string): AsyncResult<UserProfile, TicketException> {
    const ticketData = this.tickets.get(ticket)
    if (!ticketData) {
      return Err(new TicketException.InvalidTicket())
    }
    this.tickets.delete(ticket)
    return Ok(ticketData)
  }

}
