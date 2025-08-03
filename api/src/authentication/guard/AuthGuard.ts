import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UnauthorizedException } from "authentication/exceptions/UnauthorizedException";
import { UnauthticatedException } from "authentication/exceptions/UnauthticatedException";
import { VerifyToken } from "authentication/usecases/VerifyToken";
import { FastifyRequest } from "fastify";
import { Role } from "user/entities/Role";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly verifyToken: VerifyToken,
    private readonly reflector: Reflector
  ) { }

  async canActivate(context: ExecutionContext) {
    const requireRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requireRoles) return true

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const authHeader = request.headers['authorization']

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException(
        new UnauthticatedException().details(),
        HttpStatus.UNAUTHORIZED,
      )
    }

    const token = authHeader.split(' ')[1]
    const verifyTokenResult = await tryAsync(() => this.verifyToken.execute(token))

    if (verifyTokenResult.failure) {
      throw verifyTokenResult.error.details()
    }

    const { value: userProfile } = verifyTokenResult
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
