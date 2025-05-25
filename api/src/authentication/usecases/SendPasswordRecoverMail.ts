import { inject, singleton } from "tsyringe";
import { GeneratePasswordRecoverTicket } from "./GeneratePasswordRecoverTicket";

@singleton()
export class SendPasswordRecoverMail {

  constructor(
    @inject('GeneratePasswordRecoverTicket') private readonly generateTicket: GeneratePasswordRecoverTicket
  ) { }

  async execute(email: string): Promise<void> {
    const ticket = (await this.generateTicket.execute(email)).orElseNull()
    if (!ticket) return
    console.log(`Sending password recovery email to ${email} with ticket: ${ticket}`);
  }

}
