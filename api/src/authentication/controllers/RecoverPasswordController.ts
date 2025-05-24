import { RecoverPassword } from "authentication/usecases/RecoverPassword";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { ControllerInterface } from "shared/interfaces/ControllerInterface";
import { inject, singleton } from "tsyringe";
import z from "zod";

@singleton()
export class RecoverPasswordController implements ControllerInterface {

  constructor(
    @inject('RecoverPassword') private readonly recoverPassword: RecoverPassword
  ) { }

  private readonly tags = ['Authentication']

  RECOVER_PASSWORD_REQUEST_BODY_SCHEMA = z.object({
    email: z.string().email().describe('Email address of the user requesting password recovery')
  })

  routes: FastifyPluginAsyncZod = async (app) => {

    app.post('/recover-password', {
      schema: {
        tags: this.tags,
        body: this.RECOVER_PASSWORD_REQUEST_BODY_SCHEMA,
      }
    }, async (request, reply) => {
      const { email } = request.body;
      await this.recoverPassword.execute(email);
    })

  }

}
