import { AuthMiddleware } from "middlewares/AuthMiddleware";
import { IAuthService } from "services/AuthService/IAuthService";
import { inject, injectable } from "tsyringe";
import { ControllerInterface } from "./interfaces/ControllerInterface";
import { FastifyPluginAsync } from "fastify";
import z from "zod";

@injectable()
export class AuthController implements ControllerInterface {

  constructor(
    @inject('AuthService') private readonly authService: IAuthService,
    @inject('AuthMiddleware') private readonly authMiddleware: AuthMiddleware,
  ) { }

  private bodySchema = z.object({
    username: z.string(),
    password: z.string()
  })

  plugin: FastifyPluginAsync = async (fastify) => {
    fastify.post('/login', async (request, reply) => {
      const body = this.bodySchema.parse(request.body)
      reply.send(this.authService.signIn(body)).status(200)
    })
  };

}
