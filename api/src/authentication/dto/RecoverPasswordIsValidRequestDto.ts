import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RecoverPasswordIsValidRequestDto {
  @ApiProperty({ example: 'bqbpydh9wtt5ndc2jiswnph3' })
  @IsString()
  ticket: string
}
