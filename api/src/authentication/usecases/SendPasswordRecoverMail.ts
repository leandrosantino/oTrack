import { singleton } from "tsyringe";

@singleton()
export class SendPasswordRecoverMail {

  constructor() { }

  async execute(email: string, ticket: string): Promise<void> {
    console.log(`Sending password recovery email to ${email} with ticket: ${ticket}`);
  }

}
