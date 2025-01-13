import { IAuthService } from "services/AuthService/IAuthService";
import { inject, injectable } from "tsyringe";
import { ControllerInterface } from "interfaces/ControllerInterface";
import z from "zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { AuthMiddleware } from "middlewares/AuthMiddleware";
import { ERROR_SCHEMA } from "utils/ErrorSchema";
import { SignInExceptions } from "services/AuthService/AuthExceptions";

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
        tags: ['Users'],
        description: 'Get user data encrypted in access token',
        security: [{ BearerAuth: [] }],
        response: {
          200: this.TOKEN_DATA_SCHEMA
        }
      }
    }, async (request, reply) => {
      console.log(request.user)
      return reply.status(200).send(request.user)
    })

    app.post('/login', {
      schema: {
        tags: ['Authentication'],
        body: this.BODY_SCHEMA,
        response: {
          200: z.string().describe('Access Token'),
          400: ERROR_SCHEMA(SignInExceptions).describe('User not found'),
          401: ERROR_SCHEMA(SignInExceptions).describe('Invalid password')
        }
      }
    }, async (request, reply) => {
      const { password, username } = request.body
      const signInResult = await this.authService.signIn({ password, username })

      if (!signInResult.ok) {
        signInResult.err
          .case(SignInExceptions.USER_NOT_FOUND, () => reply.status(400).send(signInResult.err.throw('User not found')))
          .case(SignInExceptions.INVALID_PASSWORD, () => reply.status(401).send(signInResult.err.throw('Invalid password')))
        return
      }

      reply.status(200).send(signInResult.value)

    })

  };

}
