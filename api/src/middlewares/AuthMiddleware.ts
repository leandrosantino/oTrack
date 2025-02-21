import { RouteHandlerMethod } from "fastify";
import { inject, injectable } from "tsyringe";
import { IAuthService } from "services/AuthService/IAuthService";
import { Roules } from "entities/user/Roule";
import { TokenException } from "services/JwtService/TokenException";
import { AuthException } from "entities/user/exceptions/AuthException";


@injectable()
export class AuthMiddleware {

  constructor(
    @inject('AuthService') private readonly authService: IAuthService
  ) { }

  build(roles: Roules[] = []): RouteHandlerMethod {
    return async (request, reply) => {
      const authHeader = request.headers.authorization

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send(new AuthException.Unauthticated().details())
      }

      const token = authHeader.split(' ')[1]
      const verifyTokenResult = await this.authService.verifyToken(token)

      if (!verifyTokenResult.ok) {
        if (verifyTokenResult.err instanceof TokenException) reply.status(401)
        return reply.send(verifyTokenResult.err.details())
      }

      const { value: userData } = verifyTokenResult

      if (roles.length > 0 && !roles.includes(userData.roule)) {
        return reply.status(403).send(new AuthException.Unauthorized().details())
      }

      request.user = userData
    };
  }

}
