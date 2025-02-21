import { ControllerInterface } from "interfaces/ControllerInterface";
import { Roules } from "entities/user/Roule";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { AuthMiddleware } from "middlewares/AuthMiddleware";
import { inject, injectable } from "tsyringe";
import z from "zod";
import { ERROR_SCHEMA } from "schemas/ErrorSchema";
import { USER_PROFILE_SCHEMA } from "schemas/UserProfileSchema";
import { CreateUser } from "use-cases/user/CreateUser";
import { CreateUserException } from "entities/user/exceptions/CreateUserException";


@injectable()
export class UsersController implements ControllerInterface {

  constructor(
    @inject('AuthMiddleware') private readonly authMiddleware: AuthMiddleware,
    @inject('CreateUser') private readonly createUser: CreateUser
  ) { }

  private USER_SCHEMA = z.object({
    id: z.number(),
    displayName: z.string(),
    username: z.string(),
    password: z.string(),
    roule: z.nativeEnum(Roules),
  })

  routes: FastifyPluginAsyncZod = async (app) => {

    app.addHook('onRequest', this.authMiddleware.build([Roules.ADMIN]))

    app.post('/', {
      schema: {
        tags: ['Users'],
        description: 'Create a new user',
        body: this.USER_SCHEMA.omit({ id: true }),
        response: {
          201: this.USER_SCHEMA.describe('Created User'),
          401: ERROR_SCHEMA(new CreateUserException.UserAlreadyExists())
        }
      }
    }, async (request, reply) => {
      const user = request.body
      const result = await this.createUser.execute(user)

      if (result.ok) return reply.status(201).send(result.value)

      if (result.err instanceof CreateUserException.UserAlreadyExists) reply.status(400)

      return reply.send(result.err.details())
    })

    app.get('/profile', {
      schema: {
        tags: ['Users'],
        description: 'Get user data encrypted in access token',
        security: [{ BearerAuth: [] }],
        response: {
          200: USER_PROFILE_SCHEMA
        }
      }
    }, async (request, reply) => {
      return reply.status(200).send(request.user)
    })

  }


}
