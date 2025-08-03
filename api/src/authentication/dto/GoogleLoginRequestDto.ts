import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GoogleLoginRequestDto {
  @ApiProperty({ example: '<id_token>' })
  @IsString()
  idToken: string
}
