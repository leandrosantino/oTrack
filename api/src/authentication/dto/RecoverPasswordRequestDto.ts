import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class RecoverPasswordRequestDto {
  @ApiProperty({ description: 'Email address of the user requesting password recovery', example: 'jhondoe@email.com' })
  @IsEmail()
  email: string
}
