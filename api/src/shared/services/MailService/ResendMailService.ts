import { inject, singleton } from "tsyringe";
import { IMailService } from "./IMailService";
import { Resend } from "resend";
import { Properties } from "shared/utils/Properties";
import { passwordResetEmail } from "./emails/passwordResetEmail";

@singleton()
export class ResendMailService implements IMailService {

  resend: Resend;

  constructor(
    @inject('Properties') private readonly properties: Properties
  ) {
    this.resend = new Resend(this.properties.env.MAIL_SERVICE_API_KEY);
  }


  async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
    try {
      const data = await this.resend.emails.send({
        from: 'oTrack <onboarding@resend.dev>',
        to: [email],
        subject: 'oTrack - Redefinição de Senha',
        html: passwordResetEmail(resetLink),
      });
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

}
