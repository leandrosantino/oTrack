import { Inject, Injectable } from "@nestjs/common";
import { PasswordHasher } from "shared/services/PasswordHasher/PasswordHasher";
import { TicketProvider } from "authentication/services/TicketProvider/TicketProvider";
import { UserRepository } from "user/repository/UserRepository";
import { UserProfile } from "user/dto/UserProfile";

@Injectable()
export class UpdatePassword {

  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('PasswordHasher') private readonly passwordHashProvider: PasswordHasher,
    @Inject('TicketProvider') private readonly ticketProvider: TicketProvider
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
