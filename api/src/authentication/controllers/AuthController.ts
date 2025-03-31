import { inject, injectable } from "tsyringe";
import z from "zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { CookieSerializeOptions } from "@fastify/cookie";
import { SignInException } from "authentication/exceptions/SignInException";
import { TokenException } from "authentication/exceptions/TokenException";
import { Roules } from "user/Roule";
import { User } from "user/User";
import { ControllerInterface } from "shared/interfaces/ControllerInterface";
import { Logger } from "shared/Logging/Logger";
import { AuthMiddleware } from "shared/middlewares/AuthMiddleware";
import { ErrorSchema } from "shared/utils/ErrorSchema";
import { GenerateTicket } from "authentication/usecases/GenerateTicket";
import { RefreshTokens } from "authentication/usecases/RefreshTokens";
import { SignIn } from "authentication/usecases/SignIn";
import { SignOut } from "authentication/usecases/SignOut";

@injectable()
export class AuthController implements ControllerInterface {

  constructor(
    @inject('GenerateTicket') private readonly generateTicket: GenerateTicket,
    @inject('AuthMiddleware') private readonly authMiddleware: AuthMiddleware,
    @inject('RefreshTokens') private readonly refreshTokens: RefreshTokens,
    @inject('SignIn') private readonly signIn: SignIn,
    @inject('SignOut') private readonly signOut: SignOut,
    @inject('Logger') private readonly logger: Logger
  ) { }

  private readonly tags = ['Authentication']

  private LOGIN_RESQUEST_BODY_SCHEMA = z.object({
    username: z.string(),
    password: z.string()
  })

  private readonly refreshTokenCookiesName = 'refreshToken'
  private readonly refreshTokenCookiesOption: CookieSerializeOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  }

  routes: FastifyPluginAsyncZod = async (app) => {

    app.post('/login', {
      schema: {
        tags: this.tags,
        body: this.LOGIN_RESQUEST_BODY_SCHEMA,
        response: {
          200: z.string().describe('Access Token'),
          404: ErrorSchema.build(SignInException.UserNotFound),
          401: ErrorSchema.build(SignInException.InvalidPassword),
        }
      }
    }, async (request, reply) => {
      const { password, username } = request.body
      const result = await this.signIn.execute({ password, username })

      if (result.ok) {
        const { accessToken, refreshToken } = result.value
        return reply
          .setCookie(this.refreshTokenCookiesName, refreshToken, this.refreshTokenCookiesOption)
          .status(200).send(accessToken)
      }

      if (result.err instanceof SignInException.UserNotFound) reply.status(404)
      if (result.err instanceof SignInException.InvalidPassword) reply.status(400)

      return reply.send(result.err.details())
    })

    app.get('/refresh', {
      schema: {
        tags: this.tags,
        response: {
          200: z.string().describe('Access Token'),
          401: ErrorSchema.build(TokenException.ExpiredToken)
            .or(ErrorSchema.build(TokenException.InvalidToken))
        }
      }
    }, async (request, reply) => {
      const refreshToken = request.cookies.refreshToken ?? '';
      const result = await this.refreshTokens.execute(refreshToken)

      if (result.ok) {
        const { accessToken, refreshToken: newRefreshToken } = result.value
        return reply
          .setCookie(this.refreshTokenCookiesName, newRefreshToken, this.refreshTokenCookiesOption)
          .status(200).send(accessToken)
      }

      if (result.err instanceof TokenException) reply.status(401)

      if (result.err instanceof TokenException.AlreadyUsedToken) {
        this.logger.info('Attempt to refresh tokens using a discarded token')
        return reply.send(new TokenException.InvalidToken().details())
      }

      return reply.send(result.err.details())
    })

    app.post('/logout', {
      schema: { tags: this.tags }
    }, async (request, reply) => {
      const refreshToken = request.cookies.refreshToken ?? '';
      await this.signOut.execute(refreshToken)
      reply.setCookie(this.refreshTokenCookiesName, '', this.refreshTokenCookiesOption).status(200)
    })

    app.get('/websocket-ticket', {
      onRequest: this.authMiddleware.build([Roules.ADMIN]),
      schema: {
        tags: this.tags,
        description: 'Get a websocket ticket',
        response: {
          200: z.string()
        },
        security: [{ BearerAuth: [] }],
      },
    }, async (request, reply) => {
      const user = request.user as User
      const ticket = await this.generateTicket.execute(user)
      reply.send(ticket)
    })

  }


};


