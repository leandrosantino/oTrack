import { CreateUser } from "user/usecases/CreateUser"
import { Role } from "user/entities/Role"
import { SignUpRequestDTO } from "authentication/dto/SignUpRequestDTO"
import { Injectable } from "@nestjs/common"

@Injectable()
export class SignUp {

  constructor(
    private readonly createUser: CreateUser
  ) { }


  async execute(data: SignUpRequestDTO) {
    return this.createUser.execute({
      ...data,
      emailIsVerified: false,
      role: Role.ADMIN
    })
  }
}
