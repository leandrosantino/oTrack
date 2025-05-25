import { IPasswordHasher } from "authentication/services/PasswordHasher/IPasswordHasher";
import { ITicketProvider } from "authentication/services/TicketProvider/ITicketProvider";
import { inject, singleton } from "tsyringe";
import { IUserRepository } from "user/IUserRepository";
import { UserProfile } from "user/UserProfile";

@singleton()
export class UpdatePassword {

  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('PasswordHasher') private readonly passwordHashProvider: IPasswordHasher,
    @inject('TicketProvider') private readonly ticketProvider: ITicketProvider
  ) { }

  async execute(newPassword: string, ticket: string): Promise<void> {
    const userProfile = (await this.ticketProvider.use<UserProfile>(ticket)).orElseNull()
    if (!userProfile) return

    const user = await this.userRepository.getByEmail(userProfile.email)
    if (!user) return

    const hashedPassword = await this.passwordHashProvider.hash(newPassword)
    user.password = hashedPassword
    await this.userRepository.update(user)
  }

}
