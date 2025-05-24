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
    @inject('AuthMiddleware') private readonly authMiddleware: AuthMiddleware,
    @inject('CreateUser') private readonly createUser: CreateUser
  ) { }

  private USER_SCHEMA = z.object({
    id: z.number(),
    email: z.string(),
    displayName: z.string(),
    password: z.string(),
    role: z.nativeEnum(Role),
    profilePictureUrl: z.string().url().optional(),
  })

  routes: FastifyPluginAsyncZod = async (app) => {

    app.addHook('onRequest', this.authMiddleware.build([Role.ADMIN]))

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
