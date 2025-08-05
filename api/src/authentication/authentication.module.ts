import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth-controller/auth.controller';
import { SignIn } from './usecases/SignIn';
import { JsonWebTokenProvider } from './services/TokenProvider/JsonWebTokenProvider';
import { RefreshTokens } from './usecases/RefreshTokens';
import { SignOut } from './usecases/SignOut';
import { GoogleAuth } from './services/GoogleAuth/GoogleAuth';
import { SignInWithGoogle } from './usecases/SignInWithGoogle';
import { SignUp } from './usecases/SignUp';
import { GenerateWebSocketTicket } from './usecases/GenerateWebSocketTicket';
import { CuidTicketProvider } from './services/TicketProvider/CuidTicketProvider';
import { VerifyToken } from './usecases/VerifyToken';
import { RecoverPasswordController } from './controllers/recover-password.controller';
import { SendPasswordRecoverMail } from './usecases/SendPasswordRecoverMail';
import { UpdatePassword } from './usecases/UpdatePassword';
import { GeneratePasswordRecoverTicket } from './usecases/GeneratePasswordRecoverTicket';
import { UserModule } from 'user/user.module';
import { SharedModule } from 'shared/shared.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard/AuthGuard';

@Module({
  controllers: [AuthController, RecoverPasswordController],
  imports: [UserModule, SharedModule],
  providers: [
    { provide: 'TokenProvider', useClass: JsonWebTokenProvider },
    { provide: 'TicketProvider', useClass: CuidTicketProvider },
    { provide: 'GoogleAuth', useClass: GoogleAuth },
    { provide: APP_GUARD, useClass: AuthGuard },
    GeneratePasswordRecoverTicket,
    SendPasswordRecoverMail,
    UpdatePassword,
    GenerateWebSocketTicket,
    SignInWithGoogle,
    RefreshTokens,
    VerifyToken,
    SignOut,
    SignUp,
    SignIn,
  ],
  exports: ['TicketProvider']
})
export class AuthModule { }
