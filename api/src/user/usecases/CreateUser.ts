import { IPasswordHasher } from "authentication/services/PasswordHasher/IPasswordHasher"
import { inject, singleton } from "tsyringe"
import { CreateUserException } from "user/exceptions/CreateUserException"
import { IUserRepository } from "user/IUserRepository"
import { User } from "user/User"

@singleton()
export class CreateUser {
  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('PasswordHasher') private readonly passwordHasher: IPasswordHasher
  ) { }

  async execute(user: Omit<User, "id" | "tokens">): AsyncResult<Omit<User, "tokens">, CreateUserException> {
    const alreadyExists = await this.userRepository.existsByUsername(user.username)

    if (alreadyExists) {
      return Err(new CreateUserException.UserAlreadyExists())
    }
    user.password = await this.passwordHasher.hash(user.password)

    const createUser = await this.userRepository.create(user)
    return Ok(createUser)
  }
}
