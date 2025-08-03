import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'authentication/guard/AuthGuard';
import { Role } from 'user/entities/Role';

export const Protected = (roles: Role[] = []) => applyDecorators(
  ApiBearerAuth(),
  SetMetadata('roles', roles),
)
