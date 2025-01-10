import { IAuthService } from "services/AuthService/IAuthService";
import { inject, injectable } from "tsyringe";
import { ControllerInterface } from "../types/PluginInterface";
import { FastifyPluginAsync } from "fastify";
import z from "zod";

@injectable()
export class AuthController implements ControllerInterface {

  constructor(
    @inject('AuthService') private readonly authService: IAuthService,
  ) { }

  private bodySchema = z.object({
    username: z.string(),
    password: z.string()
  })

  routes: FastifyPluginAsync = async (app) => {
    app.post('/login', async (request, reply) => {
      const body = this.bodySchema.parse(request.body)
      reply.send(this.authService.signIn(body)).status(200)
    })
  };

}
