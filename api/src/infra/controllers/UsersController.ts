import { CreateUser } from "application/use-cases/user/CreateUser"
import { UserProfileValidator } from "application/validation/UserProfileValidator"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { ERROR_SCHEMA } from "infra/swagger/ErrorSchema"
import { AuthMiddleware } from "infra/middlewares/AuthMiddleware"
import { injectable, inject } from "tsyringe"
import z from "zod"
import { CreateUserException } from "domain/entities/user/exceptions/CreateUserException"
import { Roules } from "domain/entities/user/Roule"


@injectable()
export class UsersController {

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
          401: ERROR_SCHEMA(CreateUserException.UserAlreadyExists)
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
          200: UserProfileValidator.SCHEMA.describe('User Profile'),
        }
      }
    }, async (request, reply) => {
      return reply.status(200).send(request.user)
    })

  }


}
