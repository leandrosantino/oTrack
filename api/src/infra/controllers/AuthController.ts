import { inject, injectable } from "tsyringe"
import z from "zod"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { AuthMiddleware } from "infra/middlewares/AuthMiddleware"
import { ERROR_SCHEMA } from "infra/swagger/ErrorSchema"
import { CookieSerializeOptions } from "@fastify/cookie"
import { TokenException } from "application/security/TokenException"
import { RefreshTokens } from "application/use-cases/authentication/RefreshTokens"
import { SignIn } from "application/use-cases/authentication/SignIn"
import { SignOut } from "application/use-cases/authentication/SignOut"
import { WebSocketAuthenticator } from "infra/websocket/WebSocketAuthenticator"
import { SignInException } from "domain/entities/user/exceptions/SignInException"
import { Roules } from "domain/entities/user/Roule"
import { User } from "domain/entities/user/User"

@injectable()
export class AuthController {

  constructor(
    @inject('WebSocketAuthService') private readonly webSocketAuthService: WebSocketAuthenticator,
    @inject('AuthMiddleware') private readonly authMiddleware: AuthMiddleware,
    @inject('RefreshTokens') private readonly refreshTokens: RefreshTokens,
    @inject('SignIn') private readonly signIn: SignIn,
    @inject('SignOut') private readonly signOut: SignOut
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
          404: ERROR_SCHEMA(SignInException.UserNotFound),
          401: ERROR_SCHEMA(SignInException.InvalidPassword),
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
          401: ERROR_SCHEMA(TokenException.ExpiredToken).or(ERROR_SCHEMA(TokenException.InvalidToken))
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
      const ticket = await this.webSocketAuthService.generateTicket(user)
      reply.send(ticket)
    })

  }


};


