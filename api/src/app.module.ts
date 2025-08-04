import { Module } from '@nestjs/common';
import { AuthModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { ServiceOrderModule } from './service-order/service-order.module';

@Module({
  imports: [AuthModule, UserModule, SharedModule, ServiceOrderModule]
})
export class AppModule { }
