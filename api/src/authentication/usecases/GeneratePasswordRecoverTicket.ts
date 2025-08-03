import { UserProfile } from "user/dto/UserProfile";
import { TicketProvider } from "authentication/services/TicketProvider/TicketProvider";
import { UserRepository } from "user/repository/UserRepository";
import { Inject, Injectable } from "@nestjs/common";
import { UserNotFoundException } from "authentication/exceptions/UserNotFoundException";

@Injectable()
export class GeneratePasswordRecoverTicket {

  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('TicketProvider') private readonly ticketProvider: TicketProvider
  ) { }

  TICKET_VALIDITY_IN_MINUTES = 5

  async execute(email: string): Promise<string> {
    const user = await this.userRepository.getByEmail(email)
    if (!user) throw new UserNotFoundException();
    const recoverTicket = this.ticketProvider.generate(new UserProfile(user), this.TICKET_VALIDITY_IN_MINUTES)
    return recoverTicket
  }

}
