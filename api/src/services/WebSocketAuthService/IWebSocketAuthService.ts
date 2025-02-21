import { UserProfile } from "entities/user/UserProfile"
import { TicketException } from "./TicketException"

export interface IWebSocketAuthService {
  generateTicket(ticketData: UserProfile): Promise<string>
  verifyTicket(ticket: string): AsyncResult<UserProfile, TicketException>
}

