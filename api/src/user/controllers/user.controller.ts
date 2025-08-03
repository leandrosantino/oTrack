import { Controller, Get, Req } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { Protected } from 'lib/decorators/Protected';
import { UserProfile } from 'user/dto/UserProfile';
import { Role } from 'user/entities/Role';

@ApiTags('User')
@Controller('user')
export class UserController {

  @Protected([Role.ADMIN])
  @Get('profile')
  @ApiOkResponse({ description: 'User data encrypted in access token', type: UserProfile })
  async getProfile(@Req() request: FastifyRequest) {
    return request.user!
  }

}
