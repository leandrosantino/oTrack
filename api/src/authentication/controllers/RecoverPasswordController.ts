import { ITicketProvider } from "authentication/services/TicketProvider/ITicketProvider";
import { SendPasswordRecoverMail } from "authentication/usecases/SendPasswordRecoverMail";
import { UpdatePassword } from "authentication/usecases/UpdatePassword";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { ControllerInterface } from "shared/interfaces/ControllerInterface";
import { inject, singleton } from "tsyringe";
import z from "zod";

@singleton()
export class RecoverPasswordController implements ControllerInterface {

  constructor(
    @inject('SendPasswordRecoverMail') private readonly sendPasswordRecoverMail: SendPasswordRecoverMail,
    @inject('TicketProvider') private readonly ticketProvider: ITicketProvider,
    @inject('UpdatePassword') private readonly updatePassword: UpdatePassword
  ) { }

  private readonly tags = ['Authentication']

  RECOVER_PASSWORD_REQUEST_BODY_SCHEMA = z.object({
    email: z.string().email().describe('Email address of the user requesting password recovery')
  })
  UPDATE_PASSWORD_REQUEST_BODY_SCHEMA = z.object({
    newPassword: z.string().describe('New password to be set'),
    ticket: z.string().describe('Ticket to identify the user')
  })

  routes: FastifyPluginAsyncZod = async (app) => {

    app.post('/update-password', {
      schema: {
        tags: this.tags,
        description: 'Update the password of a user',
        body: this.UPDATE_PASSWORD_REQUEST_BODY_SCHEMA,
      }
    }, async (request) => {
      const { newPassword, ticket } = request.body;
      await this.updatePassword.execute(newPassword, ticket);
    })

    app.post('/recover-password', {
      schema: {
        tags: this.tags,
        description: 'Request a password recovery email',
        body: this.RECOVER_PASSWORD_REQUEST_BODY_SCHEMA,
      }
    }, async (request) => {
      const { email } = request.body;
      await this.sendPasswordRecoverMail.execute(email);
    })

    app.post('/recover-password/isValid', {
      schema: {
        tags: this.tags,
        description: 'Check if the password recovery ticket is valid',
        body: z.object({
          ticket: z.string().describe('Ticket to check if it is valid')
        }),
        response: {
          200: z.object({
            isValid: z.boolean().describe('Check if the password recovery ticket is valid')
          })
        },
      }
    }, async (request, reply) => {
      const { ticket } = request.body;
      reply.send({
        isValid: this.ticketProvider.isValid(ticket)
      })
    })

  }

}
