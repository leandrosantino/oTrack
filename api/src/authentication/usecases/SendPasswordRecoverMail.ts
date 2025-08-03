import { GeneratePasswordRecoverTicket } from "./GeneratePasswordRecoverTicket";
import { IMailService } from "shared/services/MailService/IMailService";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class SendPasswordRecoverMail {

  constructor(
    private readonly generateTicket: GeneratePasswordRecoverTicket,
    @Inject('MailService') private readonly mailService: IMailService
  ) { }

  async execute(email: string): Promise<void> {
    const ticket = await this.generateTicket.execute(email)
    if (!ticket) return
    const resetLink = `${properties.WEB_APP_ENDPOINT}${properties.WEB_APP_PASSWORD_RESET_ROUTE}/${ticket}`
    this.mailService.sendPasswordResetEmail(email, resetLink)
  }

}
