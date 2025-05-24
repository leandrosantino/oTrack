import { inject, singleton } from "tsyringe";
import { GeneratePasswordRecoverTicket } from "./GeneratePasswordRecoverTicket";
import { SendPasswordRecoverMail } from "./SendPasswordRecoverMail";

@singleton()
export class RecoverPassword {

  constructor(
    @inject('SendPasswordRecoverMail') private readonly sendPasswordRecoverMail: SendPasswordRecoverMail,
    @inject('GeneratePasswordRecoverTicket') private readonly generateTicket: GeneratePasswordRecoverTicket
  ) { }

  async execute(email: string): Promise<void> {
    const ticket = (await this.generateTicket.execute(email)).orElseNull()
    if (!ticket) return
    await this.sendPasswordRecoverMail.execute(email, ticket);
  }

}
