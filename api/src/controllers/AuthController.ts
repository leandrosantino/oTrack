import { IAuthService } from "services/AuthService/IAuthService";
import { inject, injectable } from "tsyringe";
import { ControllerInterface } from "interfaces/ControllerInterface";
import z from "zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { AuthMiddleware } from "middlewares/AuthMiddleware";
import { ERROR_SCHEMA } from "schemas/ErrorSchema";
import { SignInExceptions } from "services/AuthService/AuthExceptions";
import { CookieSerializeOptions } from "@fastify/cookie";
import { TokenExceptions } from "services/JwtService/TokenExceptions";
import { Roules } from "entities/user/Roule";
import { User } from "entities/user/User";
import { IWebSocketAuthService } from "services/WebSocketAuthService.ts/IWebSocketAuthService";

@injectable()
export class AuthController implements ControllerInterface {

  constructor(
    @inject('AuthService') private readonly authService: IAuthService,
    @inject('WebSocketAuthService') private readonly webSocketAuthService: IWebSocketAuthService,
    @inject('AuthMiddleware') private readonly authMiddleware: AuthMiddleware
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
          404: ERROR_SCHEMA(SignInExceptions.USER_NOT_FOUND).describe('User not found'),
          401: ERROR_SCHEMA(SignInExceptions.INVALID_PASSWORD).describe('Invalid password'),
        }
      }
    }, async (request, reply) => {
      const { password, username } = request.body
      const signInResult = await this.authService.signIn({ password, username })

      if (!signInResult.ok) {
        const { err } = signInResult
        err.case(SignInExceptions.USER_NOT_FOUND, () => reply.status(404).send(signInResult.err.throw('User not found')))
        err.case(SignInExceptions.INVALID_PASSWORD, () => reply.status(400).send(signInResult.err.throw('Invalid password')))
        return
      }

      const { accessToken, refreshToken } = signInResult.value

      reply
        .setCookie(this.refreshTokenCookiesName, refreshToken, this.refreshTokenCookiesOption)
        .status(200).send(accessToken)
    })

    app.get('/refresh', {
      schema: {
        tags: this.tags,
        response: {
          200: z.string().describe('Access Token'),
          401: ERROR_SCHEMA(TokenExceptions.EXPIRED_TOKEN).describe('Refresh token expired')
            .or(ERROR_SCHEMA(TokenExceptions.INVALID_TOKEN).describe('Invalid refresh token'))
        }
      }
    }, async (request, reply) => {
      const refreshToken = request.cookies.refreshToken ?? '';

      const refreshTokensResult = await this.authService.refreshTokens(refreshToken)

      if (!refreshTokensResult.ok) {
        const { err } = refreshTokensResult
        err.case(TokenExceptions.EXPIRED_TOKEN, () => reply.status(401).send(err.throw('Refresh token expired')))
        err.case(TokenExceptions.INVALID_TOKEN, () => reply.status(401).send(err.throw('Invalid refresh token')))
        return
      }

      const { accessToken, refreshToken: newRefreshToken } = refreshTokensResult.value
      reply
        .setCookie(this.refreshTokenCookiesName, newRefreshToken, this.refreshTokenCookiesOption)
        .status(200).send(accessToken)
    })

    app.post('/logout', {
      schema: { tags: this.tags }
    }, async (request, reply) => {
      const refreshToken = request.cookies.refreshToken ?? '';
      await this.authService.signOut(refreshToken)
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


