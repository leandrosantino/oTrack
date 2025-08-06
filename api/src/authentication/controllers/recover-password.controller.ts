import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RecoverPasswordIsValidRequestDto } from 'authentication/dto/RecoverPasswordIsValidRequestDto';
import { RecoverPasswordRequestDto } from 'authentication/dto/RecoverPasswordRequestDto';
import { UpdatePasswordRequestDto } from 'authentication/dto/UpdatePasswordRequestDto';
import { TicketProvider } from 'authentication/services/TicketProvider/TicketProvider';
import { SendPasswordRecoverMail } from 'authentication/usecases/SendPasswordRecoverMail';
import { UpdatePassword } from 'authentication/usecases/UpdatePassword';

@ApiTags('Authentication')
@Controller('auth')
export class RecoverPasswordController {

  constructor(
    private readonly sendPasswordRecoverMail: SendPasswordRecoverMail,
    private readonly updatePasswordUseCase: UpdatePassword,
    @Inject('TicketProvider') private readonly ticketProvider: TicketProvider
  ) { }

  @Post('update-password')
  async updatePassword(@Body() { newPassword, ticket }: UpdatePasswordRequestDto) {
    await this.updatePasswordUseCase.execute(newPassword, ticket);
  }

  @Post('recover-password')
  async recoverPassword(@Body() { email }: RecoverPasswordRequestDto) {
    await this.sendPasswordRecoverMail.execute(email);
  }

  @Post('recover-password/isValid')
  @ApiOkResponse({ example: { isValid: true } })
  async recoverPasswordTicketIsValid(@Body() { ticket }: RecoverPasswordIsValidRequestDto,) {
    const isValid = await this.ticketProvider.isValid(ticket)
    return { isValid }
  }

}
