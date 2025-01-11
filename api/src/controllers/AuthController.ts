import { IAuthService } from "services/AuthService/IAuthService";
import { inject, injectable } from "tsyringe";
import { ControllerInterface } from "entities/types/PluginInterface";
import z from "zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { AuthMiddleware } from "middlewares/AuthMiddleware";
import { ErrorMessage } from "entities/types/ErrorMessage";

@injectable()
export class AuthController implements ControllerInterface {

  constructor(
    @inject('AuthService') private readonly authService: IAuthService,
    @inject('AuthMiddleware') private readonly authMiddleware: AuthMiddleware
  ) { }

  private BODY_SCHEMA = z.object({
    username: z.string(),
    password: z.string()
  })

  private TOKEN_DATA_SCHEMA = z.object({
    id: z.number(),
    username: z.string(),
    displayName: z.string(),
    roule: z.string(),
  })

  routes: FastifyPluginAsyncZod = async (app) => {
    app.get('/profile', {
      onRequest: this.authMiddleware.build(),
      schema: {
        security: [{ BearerAuth: [] }],
        response: {
          200: this.TOKEN_DATA_SCHEMA
        }
      }
    }, async (request, reply) => {
      return reply.status(200).send(request.user)
    })

    app.post('/login', {
      schema: {
        body: this.BODY_SCHEMA,
        response: {
          200: z.string().describe('Access Token'),
          400: z.string().describe('User not found'),
          401: z.string().describe('Invalid password')
        }
      }
    }, async (request, reply) => {
      const { password, username } = request.body
      try {
        const token = await this.authService.signIn({ password, username })
        reply.status(200).send(token)
      } catch (err) {
        switch ((err as Error).cause) {
          case ErrorMessage.NOT_FOUND: reply.status(400).send('User not found'); break
          case ErrorMessage.VALIDATION_ERROR: reply.status(401).send('Invalid password'); break
          default: break;
        }
      }
    })

  };

}
