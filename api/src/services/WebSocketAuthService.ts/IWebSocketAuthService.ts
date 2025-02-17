import { Roules } from "entities/user/Roule"
import { TicketExceptions } from "./TicketExceptions"
import { Token } from "typescript"
import { UserProfile } from "services/AuthService/IAuthService"

export interface IWebSocketAuthService {
  generateTicket(ticketData: TicketData): Promise<string>
  verifyTicket(ticket: string): AsyncResult<TicketData, TicketExceptions>
}

export type TicketData = UserProfile
