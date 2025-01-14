import { ControllerInterface } from "interfaces/ControllerInterface";
import { Roules } from "entities/user/Roule";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { AuthMiddleware } from "middlewares/AuthMiddleware";
import { inject, injectable } from "tsyringe";
import z from "zod";
import { IUserService } from "services/UserService/IUserService";
import { UserCreateExceptions } from "entities/user/UserExceptions";
import { ERROR_SCHEMA } from "utils/ErrorSchema";


@injectable()
export class UsersController implements ControllerInterface {

  constructor(
    @inject('AuthMiddleware') private readonly authMiddleware: AuthMiddleware,
    @inject('UserService') private readonly userService: IUserService
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
    app.post('/users', {
      schema: {
        tags: ['Users'],
        description: 'Create a new user',
        body: this.USER_SCHEMA.omit({ id: true }),
        response: {
          201: this.USER_SCHEMA.describe('Created User'),
          401: ERROR_SCHEMA(UserCreateExceptions.USER_ALREADY_EXISTS).describe('User already exists')
        }
      }
    }, async (request, reply) => {
      const user = request.body
      const createUserResult = await this.userService.create(user)

      if (!createUserResult.ok) {
        createUserResult.err
          .case(UserCreateExceptions.USER_ALREADY_EXISTS, () => reply.status(401).send(createUserResult.err.throw('user already exists')))
        return
      }

      reply.status(201).send(createUserResult.value)
    })

  }


}
