import { RouteHandlerMethod } from "fastify";
import { inject, injectable } from "tsyringe";
import { Roules } from "entities/user/Roule";
import { AuthException } from "entities/user/exceptions/AuthException";
import { IWebSocketAuthService } from "services/WebSocketAuthService/IWebSocketAuthService";
import { TicketException } from "services/WebSocketAuthService/TicketException";


@injectable()
export class WebSocketAuthMiddleware {

  constructor(
    @inject('WebSocketAuthService') private readonly webSocketAuthService: IWebSocketAuthService
  ) { }

  build(roles: Roules[] = []): RouteHandlerMethod {
    return async (request, reply) => {
      const { ticket } = request.params as { ticket: string }

      if (!ticket) return reply.status(401).send(new AuthException.Unauthticated().details())

      const verifyTicketResult = await this.webSocketAuthService.verifyTicket(ticket)

      if (!verifyTicketResult.ok) {
        if (verifyTicketResult.err instanceof TicketException) reply.status(401)
        return reply.send(verifyTicketResult.err.details())
      }

      const { value: userData } = verifyTicketResult

      if (roles.length > 0 && !roles.includes(userData.roule)) {
        return reply.status(403).send(new AuthException.Unauthorized().details())
      }

      request.user = userData
    };
  }

}
