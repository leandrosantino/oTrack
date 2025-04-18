import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { inject, injectable } from "tsyringe";
import z from "zod";
import { CreateUser } from "user/usecases/CreateUser";
import { ControllerInterface } from "shared/interfaces/ControllerInterface";
import { AuthMiddleware } from "shared/middlewares/AuthMiddleware";
import { ErrorSchema } from "shared/utils/ErrorSchema";
import { CreateUserException } from "user/exceptions/CreateUserException";
import { Roules } from "user/Roule";
import { UserProfileValidator } from "user/validators/UserProfileValidator";

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
          401: ErrorSchema.build(CreateUserException.UserAlreadyExists)
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
