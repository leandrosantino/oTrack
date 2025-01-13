import { ControllerInterface } from "interfaces/ControllerInterface";
import { Roules } from "entities/user/Roule";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { AuthMiddleware } from "middlewares/AuthMiddleware";
import { UserRepository } from "repository/UserRepository";
import { inject, injectable } from "tsyringe";
import z, { object } from "zod";


@injectable()
export class UsersController implements ControllerInterface {

  constructor(
    @inject('AuthMiddleware') private readonly authMiddleware: AuthMiddleware,
    @inject('UserRepository') private readonly userRepository: UserRepository
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
          201: this.USER_SCHEMA
        }
      }
    }, async (request, reply) => {
      const user = request.body
      const createdUser = await this.userRepository.create(user)
      reply.status(201).send(createdUser)
    })

  }


}
