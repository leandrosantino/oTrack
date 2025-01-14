import bcrypt from 'bcrypt';
import { injectable } from "tsyringe";
import { IPasswordHasher } from "./IPasswordHasher";

@injectable()
export class PasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async verify(password: string, hashedPassword: string): Promise<Boolean> {
    return await this.hash(password) === hashedPassword
  }

}
