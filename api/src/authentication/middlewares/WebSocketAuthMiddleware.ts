import { RouteHandlerMethod } from "fastify";
import { inject, injectable } from "tsyringe";
import { AuthException } from "authentication/exceptions/AuthException";
import { Role } from "user/Role";
import { UserProfile } from "user/UserProfile";
import { ITicketProvider } from "authentication/services/TicketProvider/ITicketProvider";

@injectable()
export class WebSocketAuthMiddleware {

  constructor(
    @inject('TicketProvider') private readonly ticketProvider: ITicketProvider
  ) { }

  build(roles: Role[] = []): RouteHandlerMethod {
    return async (request, reply) => {
      const { ticket } = request.params as { ticket: string }

      if (!ticket) return reply.status(401).send(new AuthException.Unauthticated().details())

      const verifyTicketResult = await this.ticketProvider.use<UserProfile>(ticket)

      if (!verifyTicketResult.ok) {
        return reply.status(401).send(verifyTicketResult.err.details())
      }

      const { value: userProfile } = verifyTicketResult

      if (roles.length > 0 && !roles.includes(userProfile.role)) {
        return reply.status(403).send(new AuthException.Unauthorized().details())
      }

      request.user = userProfile
    };
  }

}
