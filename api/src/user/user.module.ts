import { Module } from '@nestjs/common';
import { PrismaUserRepository } from './repository/PrismaUserRepository';
import { CreateUser } from './usecases/CreateUser';
import { SharedModule } from 'shared/shared.module';
import { UserController } from './controllers/user.controller';

@Module({
  controllers: [UserController],
  imports: [SharedModule],
  providers: [
    { provide: 'UserRepository', useClass: PrismaUserRepository },
    CreateUser,
  ],
  exports: [CreateUser, 'UserRepository'],
})
export class UserModule { }
