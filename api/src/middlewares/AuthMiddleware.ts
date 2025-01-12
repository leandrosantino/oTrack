import { RouteHandlerMethod } from "fastify";
import { inject, injectable } from "tsyringe";
import { IAuthService } from "services/AuthService/IAuthService";
import { Roules } from "entities/user/Roule";


@injectable()
export class AuthMiddleware {

  constructor(
    @inject('AuthService') private readonly authService: IAuthService
  ) { }

  build(roles: Roules[] = []): RouteHandlerMethod {
    return async (request, reply) => {
      const authHeader = request.headers.authorization

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        reply.status(401).send({ error: 'Unauthorized' })
        return
      }

      try {
        const token = authHeader.split(' ')[1]
        const userData = await this.authService.verifyToken(token)

        if (roles.length > 0 && !roles.includes(userData.roule)) {
          reply.status(403).send({ error: 'You do not have permission to access this resource' })
          return
        }

        request.user = userData
      } catch (err) {
        console.log(err)
        reply.status(403).send({ error: 'Invalid token' })
      }

    };
  }

}
