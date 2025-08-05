import { Injectable, Inject } from "@nestjs/common";
import { TicketProvider } from "authentication/services/TicketProvider/TicketProvider";
import { FastifyRequest } from "fastify";
import { Role } from "user/entities/Role";
import { UserProfile } from "user/dto/UserProfile";
import { UnauthticatedException } from "authentication/exceptions/UnauthticatedException";
import { UnauthorizedException } from "authentication/exceptions/UnauthorizedException";
import { WebSocket } from 'ws';

@Injectable()
export class WebsocketAuthGuard {

  constructor(
    @Inject('TicketProvider') private readonly ticketProvider: TicketProvider
  ) { }

  async canActivate(socket: WebSocket, request: FastifyRequest, requiredRoles: Role[]) {
    const { ticket } = request.params as { ticket: string }

    if (!ticket) {
      this.sendError(socket, new UnauthticatedException().details())
      return false
    }

    const verifyTicketResult = await this.ticketProvider.use<UserProfile>(ticket)

    if (verifyTicketResult.failure) {
      this.sendError(socket, verifyTicketResult.error.details())
      return false
    }

    const { value: userProfile } = verifyTicketResult

    if (requiredRoles.length > 0 && !requiredRoles.includes(userProfile.role)) {
      this.sendError(socket, new UnauthorizedException().details())
      return false
    }

    request.user = userProfile
    return true
  }

  sendError(socket: WebSocket, error: any) {
    socket.send(JSON.stringify({ event: 'error', payload: error }))
  }

}
