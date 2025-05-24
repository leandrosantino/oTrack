import { inject, singleton } from "tsyringe";
import { UserProfile } from "user/UserProfile";
import { SignInException } from "authentication/exceptions/SignInException";
import { ITicketProvider } from "authentication/services/TicketProvider/ITicketProvider";
import { IUserRepository } from "user/IUserRepository";

@singleton()
export class GeneratePasswordRecoverTicket {

  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('TicketProvider') private readonly ticketProvider: ITicketProvider
  ) { }

  TICKET_VALIDITY_IN_MINUTES = 5

  async execute(email: string): AsyncResult<string, SignInException> {
    const user = await this.userRepository.getByEmail(email)
    if (!user) return Err(new SignInException.UserNotFound());
    const recoverTicket = this.ticketProvider.generate(new UserProfile(user), this.TICKET_VALIDITY_IN_MINUTES)
    return Ok(recoverTicket)
  }

}
