import { RouteHandlerMethod } from "fastify";
import { inject, injectable } from "tsyringe";
import { Roules } from "entities/user/Roule";
import { TokenException } from "entities/user/exceptions/TokenException";
import { AuthException } from "entities/user/exceptions/AuthException";
import { VerifyToken } from "use-cases/authentication/VerifyToken";


@injectable()
export class AuthMiddleware {

  constructor(
    @inject('VerifyToken') private readonly verifyToken: VerifyToken
  ) { }

  build(roles: Roules[] = []): RouteHandlerMethod {
    return async (request, reply) => {
      const authHeader = request.headers.authorization

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send(new AuthException.Unauthticated().details())
      }

      const token = authHeader.split(' ')[1]
      const verifyTokenResult = await this.verifyToken.execute(token)

      if (!verifyTokenResult.ok) {
        return reply.status(401).send(verifyTokenResult.err.details())
      }

      const { value: userProfile } = verifyTokenResult

      if (roles.length > 0 && !roles.includes(userProfile.roule)) {
        return reply.status(403).send(new AuthException.Unauthorized().details())
      }

      request.user = userProfile
    };
  }

}
