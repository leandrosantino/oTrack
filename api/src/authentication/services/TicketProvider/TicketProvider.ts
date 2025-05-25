import { singleton } from "tsyringe";
import { ITicketProvider } from "./ITicketProvider";
import { TicketData } from "./TicketData";
import { createId } from "@paralleldrive/cuid2";
import { addMinutes, isBefore } from 'date-fns';
import { TicketException } from "authentication/exceptions/TicketException";

@singleton()
export class TicketProvider implements ITicketProvider {

  tickets: Map<string, TicketData> = new Map();

  generate(payload: object, validityInMinutes: number): string {
    const ticket = createId()
    this.tickets.set(ticket, {
      payload,
      expiresAt: addMinutes(new Date(), validityInMinutes)
    })
    return ticket
  }

  isValid(ticket: string): boolean {
    const ticketData = this.tickets.get(ticket)
    if (!ticketData) return false
    return !isBefore(ticketData.expiresAt, new Date())
  }

  async use<T>(ticket: string): AsyncResult<T, TicketException> {
    const ticketData = this.tickets.get(ticket)
    if (!ticketData) {
      return Err(new TicketException.InvalidTicket())
    }
    this.tickets.delete(ticket)

    const isExpired = isBefore(ticketData.expiresAt, new Date())
    if (isExpired) {
      return Err(new TicketException.ExpiredTicket())
    }

    return Ok(ticketData.payload)
  }

}
