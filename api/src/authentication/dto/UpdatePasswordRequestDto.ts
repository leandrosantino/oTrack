import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdatePasswordRequestDto {
  @ApiProperty({ description: 'New password to be set', example: '123456' })
  @IsString()
  newPassword: string

  @ApiProperty({ description: 'Ticket to identify the user', example: 'bqbpydh9wtt5ndc2jiswnph3' })
  @IsString()
  ticket: string
}
