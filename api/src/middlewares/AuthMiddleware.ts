import { RouteHandlerMethod } from "fastify";
import { inject, injectable } from "tsyringe";
import { IAuthService } from "services/AuthService/IAuthService";
import { Roules } from "entities/user/Roule";
import { TokenExceptions } from "services/AuthService/AuthExceptions";


@injectable()
export class AuthMiddleware {

  constructor(
    @inject('AuthService') private readonly authService: IAuthService
  ) { }

  build(roles: Roules[] = []): RouteHandlerMethod {
    return async (request, reply) => {
      const authHeader = request.headers.authorization

      console.log(await this.authService.verifyToken(request.cookies.refreshToken as string))

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        reply.status(401).send({ error: 'Unauthorized' })
        return
      }

      const token = authHeader.split(' ')[1]
      const verifyTokenResult = await this.authService.verifyToken(token)

      if (!verifyTokenResult.ok) {
        verifyTokenResult.err
          .case(TokenExceptions.INVALID_TOKEN, () => reply.status(403).send(verifyTokenResult.err.throw('invalid token')))
          .case(TokenExceptions.EXPIRES_TOKEN, () => reply.status(403).send(verifyTokenResult.err.throw('expires token')))
        return
      }

      const { value: userData } = verifyTokenResult

      if (roles.length > 0 && !roles.includes(userData.roule)) {
        reply.status(403).send({ error: 'You do not have permission to access this resource' })
        return
      }

      request.user = userData
    };
  }

}
