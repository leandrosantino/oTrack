import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString } from "class-validator"

export class SignUpRequestDTO {
  @ApiProperty({ example: 'jhondoe@email.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'Jhon Doe' })
  @IsString()
  displayName: string

  @ApiProperty({ example: '123456' })
  @IsString()
  password: string
}
