import { TicketException } from "./TicketException"
import { UserProfile } from "services/AuthService/IAuthService"

export interface IWebSocketAuthService {
  generateTicket(ticketData: TicketData): Promise<string>
  verifyTicket(ticket: string): AsyncResult<TicketData, TicketException>
}

export type TicketData = UserProfile
