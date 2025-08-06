import { singleton } from "tsyringe";
import { ExpiredTicket, InvalidTicket, TicketData, TicketProvider } from "./TicketProvider";
import { createId } from "@paralleldrive/cuid2";
import { addMinutes, isBefore } from 'date-fns';

@singleton()
export class CuidTicketProvider implements TicketProvider {

  tickets: Map<string, TicketData> = new Map();

  async generate(payload: object, validityInMinutes: number): Promise<string> {
    const ticket = createId()
    this.tickets.set(ticket, {
      payload,
      expiresAt: addMinutes(new Date(), validityInMinutes)
    })
    return ticket
  }

  async isValid(ticket: string): Promise<boolean> {
    const ticketData = this.tickets.get(ticket)
    if (!ticketData) return false
    return !isBefore(ticketData.expiresAt, new Date())
  }

  async use<T>(ticket: string): AsyncResult<T, InvalidTicket | ExpiredTicket> {
    const ticketData = this.tickets.get(ticket)
    if (!ticketData) {
      return Err(new InvalidTicket())
    }
    this.tickets.delete(ticket)

    const isExpired = isBefore(ticketData.expiresAt, new Date())
    if (isExpired) {
      return Err(new ExpiredTicket())
    }

    return Ok(ticketData.payload)
  }

}
