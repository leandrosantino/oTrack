import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'authentication/guard/AuthGuard';
import { WebsocketAuthGuard } from 'authentication/guard/WebsocketAuthGard';
import { Role } from 'user/entities/Role';

export const WsProtected = (roles: Role[] = []) => applyDecorators(
  SetMetadata('roles', roles),
  UseGuards(WebsocketAuthGuard)
)
