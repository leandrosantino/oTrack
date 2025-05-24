import { ITicketProvider } from "authentication/services/TicketProvider/ITicketProvider";
import { inject, singleton } from "tsyringe";
import { UserProfile } from "user/UserProfile";

@singleton()
export class GenerateWebSocketTicket {

  constructor(
    @inject('TicketProvider') private readonly ticketProvider: ITicketProvider
  ) { }

  TICKET_VALIDITY_IN_MINUTES = 1

  async execute(ticketData: UserProfile): Promise<string> {
    return this.ticketProvider.generate(ticketData, this.TICKET_VALIDITY_IN_MINUTES)
  }

}
