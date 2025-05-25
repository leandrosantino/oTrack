import { TicketException } from "authentication/exceptions/TicketException";

export interface ITicketProvider {
  generate(payload: object, validityInMinutes: number): string;
  use<T>(ticket: string): AsyncResult<T, TicketException>
  isValid(ticket: string): boolean
}
