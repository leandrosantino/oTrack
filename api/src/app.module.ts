import { Module } from '@nestjs/common';
import { AuthModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [AuthModule, UserModule, SharedModule],
})
export class AppModule { }
