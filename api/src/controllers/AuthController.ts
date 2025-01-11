import { IAuthService } from "services/AuthService/IAuthService";
import { inject, injectable } from "tsyringe";
import { ControllerInterface } from "../types/PluginInterface";
import z, { ErrorMapCtx, string, ZodErrorMap, ZodIssueOptionalMessage } from "zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { AuthMiddleware } from "middlewares/AuthMiddleware";

@injectable()
export class AuthController implements ControllerInterface {

  constructor(
    @inject('AuthService') private readonly authService: IAuthService,
    @inject('AuthMiddleware') private readonly authMiddleware: AuthMiddleware
  ) { }

  private bodySchema = z.object({
    username: z.string(),
    password: z.string()
  })

  routes: FastifyPluginAsyncZod = async (app) => {
    app.get('/profile', {
      onRequest: this.authMiddleware.build(),
      schema: {
        security: [{ BearerAuth: [] }],
        response: {
          200: z.object({
            uid: z.string(),
            username: z.string(),
            role: z.string(),
          })
        }
      }
    }, async (request, reply) => {
      return reply.status(200).send(request.user)
    })

    app.post('/login', {
      schema: {
        body: this.bodySchema,
        response: {
          200: z.string().describe('Access Token')
        }
      }
    }, async (request, reply) => {
      const { password, username } = request.body
      reply.status(200).send(this.authService.signIn({ password, username }))
    })

  };

}
