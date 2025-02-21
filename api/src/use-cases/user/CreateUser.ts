import { CreateUserException } from "entities/user/exceptions/CreateUserException"
import { IUserRepository } from "entities/user/IUserRepository"
import { User } from "entities/user/User"
import { UserCreateExceptions } from "entities/user/UserExceptions"
import { IPasswordHasher } from "services/PasswordHasher/IPasswordHasher"
import { inject, singleton } from "tsyringe"

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
