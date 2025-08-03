import { ApiProperty } from "@nestjs/swagger";
import { IsString } from 'class-validator';

export class SignInResquestDto {

  @IsString()
  @ApiProperty({ example: 'leandrosantino2013@gmail.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: '123456' })
  password: string;
}
