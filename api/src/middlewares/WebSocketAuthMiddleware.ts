import { RouteHandlerMethod } from "fastify";
import { inject, injectable } from "tsyringe";
import { Roules } from "entities/user/Roule";
import { AuthException } from "services/AuthService/AuthExceptions";
import { IWebSocketAuthService } from "services/WebSocketAuthService.ts/IWebSocketAuthService";
import { TicketExceptions } from "services/WebSocketAuthService.ts/TicketExceptions";


@injectable()
export class WebSocketAuthMiddleware {

  constructor(
    @inject('WebSocketAuthService') private readonly webSocketAuthService: IWebSocketAuthService
  ) { }

  build(roles: Roules[] = []): RouteHandlerMethod {
    return async (request, reply) => {
      const { ticket } = request.params as { ticket: string }

      if (!ticket) {
        reply.status(401).send({
          message: 'You are not authenticated',
          type: AuthException.UNAUTHENTICATED
        })
        return
      }

      const verifyTicketResult = await this.webSocketAuthService.verifyTicket(ticket)

      if (!verifyTicketResult.ok) {
        const { err } = verifyTicketResult
        err.case(TicketExceptions.INVALID_TICKET, () => reply.status(401).send(err.throw('invalid ticket')))
        return
      }

      const { value: userData } = verifyTicketResult

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
