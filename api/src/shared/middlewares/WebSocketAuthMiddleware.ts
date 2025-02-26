import { RouteHandlerMethod } from "fastify";
import { inject, injectable } from "tsyringe";
import { VerifyTicket } from "authentication/usecases/VerifyTicket";
import { AuthException } from "authentication/exceptions/AuthException";
import { Roules } from "user/Roule";

@injectable()
export class WebSocketAuthMiddleware {

  constructor(
    @inject('VerifyTicket') private readonly verifyTicket: VerifyTicket
  ) { }

  build(roles: Roules[] = []): RouteHandlerMethod {
    return async (request, reply) => {
      const { ticket } = request.params as { ticket: string }

      if (!ticket) return reply.status(401).send(new AuthException.Unauthticated().details())

      const verifyTicketResult = await this.verifyTicket.execute(ticket)

      if (!verifyTicketResult.ok) {
        return reply.status(401).send(verifyTicketResult.err.details())
      }

      const { value: userProfile } = verifyTicketResult

      if (roles.length > 0 && !roles.includes(userProfile.roule)) {
        return reply.status(403).send(new AuthException.Unauthorized().details())
      }

      request.user = userProfile
    };
  }

}
