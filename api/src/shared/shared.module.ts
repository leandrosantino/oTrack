import { Module } from '@nestjs/common';
import { LocalLogger } from './services/Logging/LocalLogger';
import { ResendMailService } from './services/MailService/ResendMailService';
import { BcryptPasswordHasher } from './services/PasswordHasher/BcryptPasswordHasher';
import { AxiosHttpClient } from './services/HttpClient/AxiosHttpClient';

@Module({
  providers: [
    { provide: 'Logger', useClass: LocalLogger },
    { provide: 'PasswordHasher', useClass: BcryptPasswordHasher },
    { provide: 'MailService', useClass: ResendMailService },
    { provide: 'HttpClient', useClass: AxiosHttpClient }
  ],
  exports: [
    'Logger',
    'PasswordHasher',
    'MailService',
    'HttpClient'
  ]
})
export class SharedModule { }
