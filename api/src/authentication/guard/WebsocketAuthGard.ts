import { Injectable, CanActivate, ExecutionContext, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { TicketProvider } from "authentication/services/TicketProvider/TicketProvider";
import { FastifyRequest } from "fastify";
import { Role } from "user/entities/Role";
import { UserProfile } from "user/dto/UserProfile";
import { UnauthticatedException } from "authentication/exceptions/UnauthticatedException";
import { UnauthorizedException } from "authentication/exceptions/UnauthorizedException";

@Injectable()
export class WebsocketAuthGuard implements CanActivate {

  constructor(
    @Inject('TicketProvider') private readonly ticketProvider: TicketProvider,
    private readonly reflector: Reflector
  ) { }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const { ticket } = request.params as { ticket: string }

    if (!ticket) throw new HttpException(
      new UnauthticatedException().details(),
      HttpStatus.UNAUTHORIZED
    )

    const verifyTicketResult = await this.ticketProvider.use<UserProfile>(ticket)

    if (verifyTicketResult.failure) {
      throw new HttpException(
        verifyTicketResult.error.details(),
        HttpStatus.UNAUTHORIZED
      )
    }

    const requireRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ])

    const { value: userProfile } = verifyTicketResult
    if (requireRoles.length > 0 && !requireRoles.includes(userProfile.role)) {
      throw new HttpException(
        new UnauthorizedException().details(),
        HttpStatus.FORBIDDEN
      )
    }

    request.user = userProfile
    return true
  }

}
