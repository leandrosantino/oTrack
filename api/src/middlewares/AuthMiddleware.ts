import { RouteHandlerMethod } from "fastify";
import { inject, injectable } from "tsyringe";
import { IAuthService } from "services/AuthService/IAuthService";
import { Roules } from "entities/user/Roule";
import { AuthException } from "services/AuthService/AuthExceptions";
import { TokenExceptions } from "services/JwtService/TokenExceptions";


@injectable()
export class AuthMiddleware {

  constructor(
    @inject('AuthService') private readonly authService: IAuthService
  ) { }

  build(roles: Roules[] = []): RouteHandlerMethod {
    return async (request, reply) => {
      const authHeader = request.headers.authorization

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        reply.status(401).send({
          message: 'You are not authenticated',
          type: AuthException.UNAUTHENTICATED
        })
        return
      }

      const token = authHeader.split(' ')[1]
      const verifyTokenResult = await this.authService.verifyToken(token)

      if (!verifyTokenResult.ok) {
        const { err } = verifyTokenResult
        err.case(TokenExceptions.INVALID_TOKEN, () => reply.status(401).send(err.throw('invalid token')))
        err.case(TokenExceptions.EXPIRED_TOKEN, () => reply.status(401).send(err.throw('expires token')))
        return
      }

      const { value: userData } = verifyTokenResult

      if (roles.length > 0 && !roles.includes(userData.roule)) {
        reply.status(403).send({
          message: 'You do not have permission to access this resource',
          type: AuthException.UNAUTHORIZED
        })
        return
      }

      request.user = userData
    };
  }

}
