import { singleton, inject } from "tsyringe"
import { SignUpRequestDTO } from "../DTOs"
import { CreateUser } from "user/usecases/CreateUser"
import { Role } from "user/Role"

@singleton()
export class SignUp {

  constructor(
    @inject('CreateUser') private readonly createUser: CreateUser
  ) { }


  async execute(data: SignUpRequestDTO) {
    return this.createUser.execute({
      ...data,
      emailIsVerified: false,
      role: Role.ADMIN
    })
  }
}
