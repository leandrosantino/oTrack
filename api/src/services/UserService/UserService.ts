import { User } from "entities/user/User";
import { IUserService } from "./IUserService";
import { inject, injectable } from "tsyringe";
import { IUserRepository } from "entities/user/IUserRepository";
import { UserCreateExceptions } from "entities/user/UserExceptions";
import { IPasswordHasher } from "services/PasswordHasher/IPasswordHasher";


@injectable()
export class UserService implements IUserService {

  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('PasswordHasher') private readonly passwordHasher: IPasswordHasher
  ) { }

  async create(user: Omit<User, "id">): AsyncResult<Omit<User, "tokens">, UserCreateExceptions> {
    const alreadyExists = await this.userRepository.existsByUsername(user.username)

    if (alreadyExists) {
      return Err(UserCreateExceptions.USER_ALREADY_EXISTS)
    }
    user.password = await this.passwordHasher.hash(user.password)

    const createUser = await this.userRepository.create(user)
    return Ok(createUser)
  }

}
