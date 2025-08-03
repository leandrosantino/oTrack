import { Inject, Injectable } from "@nestjs/common";
import { TicketProvider } from "authentication/services/TicketProvider/TicketProvider";
import { UserProfile } from "user/dto/UserProfile";

@Injectable()
export class GenerateWebSocketTicket {

  constructor(
    @Inject('TicketProvider') private readonly ticketProvider: TicketProvider
  ) { }

  TICKET_VALIDITY_IN_MINUTES = 1

  async execute(ticketData: UserProfile): Promise<string> {
    return this.ticketProvider.generate(ticketData, this.TICKET_VALIDITY_IN_MINUTES)
  }

}
