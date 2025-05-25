import { inject, singleton } from "tsyringe";
import { GeneratePasswordRecoverTicket } from "./GeneratePasswordRecoverTicket";
import { IMailService } from "shared/services/MailService/IMailService";
import { Properties } from "shared/utils/Properties";

@singleton()
export class SendPasswordRecoverMail {

  constructor(
    @inject('Properties') private readonly properties: Properties,
    @inject('GeneratePasswordRecoverTicket') private readonly generateTicket: GeneratePasswordRecoverTicket,
    @inject('ResendMailService') private readonly mailService: IMailService
  ) { }

  async execute(email: string): Promise<void> {
    const ticket = (await this.generateTicket.execute(email)).orElseNull()
    if (!ticket) return
    const resetLink = `${this.properties.env.WEB_APP_ENDPOINT}${this.properties.env.WEB_APP_PASSWORD_RESET_ROUTE}/${ticket}`
    this.mailService.sendPasswordResetEmail(email, resetLink)
  }

}
