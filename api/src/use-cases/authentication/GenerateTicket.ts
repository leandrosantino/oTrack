
import { createId } from "@paralleldrive/cuid2";
import { UserProfile } from "entities/user/UserProfile";
import { CuidGenerator } from "services/CuidGenerator/CuidGenerator";
import { inject, singleton } from "tsyringe";

@singleton()
export class GenerateTicket {

  constructor(
    @inject('TicketsMap') private readonly tickets: Map<string, UserProfile>,
    @inject('CuidGenerator') private readonly cuidGenerator: CuidGenerator
  ) { }

  async execute(ticketData: UserProfile): Promise<string> {
    const ticket = this.cuidGenerator.generate()
    this.tickets.set(ticket, ticketData)
    return ticket
  }

}
