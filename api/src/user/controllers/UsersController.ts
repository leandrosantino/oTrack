import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { inject, injectable } from "tsyringe";
import z from "zod";
import { CreateUser } from "user/usecases/CreateUser";
import { ControllerInterface } from "shared/interfaces/ControllerInterface";
import { AuthMiddleware } from "authentication/middlewares/AuthMiddleware";
import { ErrorSchema } from "shared/utils/ErrorSchema";
import { CreateUserException } from "user/exceptions/CreateUserException";
import { Role } from "user/Role";
import { UserProfileValidator } from "user/validators/UserProfileValidator";

@injectable()
export class UsersController implements ControllerInterface {

  constructor(
    @inject('AuthMiddleware') private readonly authMiddleware: AuthMiddleware
  ) { }

  routes: FastifyPluginAsyncZod = async (app) => {

    app.addHook('onRequest', this.authMiddleware.build([Role.ADMIN]))

    app.get('/profile', {
      schema: {
        tags: ['Users'],
        description: 'Get user data encrypted in access token',
        security: [{ BearerAuth: [] }],
        response: {
          200: UserProfileValidator.SCHEMA.describe('User Profile'),
        }
      }
    }, async (request, reply) => {
      return reply.status(200).send(request.user)
    })

  }


}
