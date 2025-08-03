import { IMailService } from "./IMailService";
import { Resend } from "resend";
import { passwordResetEmail } from "./emails/passwordResetEmail";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ResendMailService implements IMailService {

  resend: Resend;

  constructor() {
    this.resend = new Resend(properties.MAIL_SERVICE_API_KEY);
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
