import { IsBoolean, IsEmail, IsEnum, IsNumber, IsString, } from "class-validator";
import { Role } from "../entities/Role";
import { User } from "../entities/User";
import { ApiProperty } from "@nestjs/swagger";

export class UserProfile {

  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'jhondoe@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'jhon doe' })
  @IsString()
  displayName: string;

  @ApiProperty({ example: 'http://image.png' })
  @IsString()
  profilePictureUrl?: string | null;

  @ApiProperty({ example: 'ADMIN' })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ example: true })
  @IsBoolean()
  emailIsVerified: boolean;

  constructor(user: User) {
    this.id = user.id
    this.email = user.email
    this.displayName = user.displayName
    this.role = user.role
    this.profilePictureUrl = user.profilePictureUrl
    this.emailIsVerified = user.emailIsVerified
  }

}
