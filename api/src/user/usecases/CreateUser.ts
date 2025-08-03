import { Inject, Injectable } from "@nestjs/common"
import { PasswordHasher } from "shared/services/PasswordHasher/PasswordHasher"
import { UserRepository } from "user/repository/UserRepository"
import { User } from "user/entities/User"
import { UserAlreadyExists } from "user/exceptions/UserAlreadyExists"

@Injectable()
export class CreateUser {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('PasswordHasher') private readonly passwordHasher: PasswordHasher
  ) { }

  async execute(user: Omit<User, "id" | "tokens">): Promise<Omit<User, "tokens">> {
    const alreadyExists = await this.userRepository.existsByEmail(user.email)

    if (alreadyExists) {
      throw new UserAlreadyExists()
    }
    user.password = await this.passwordHasher.hash(user.password)

    const createUser = await this.userRepository.create(user)
    return createUser
  }
}
