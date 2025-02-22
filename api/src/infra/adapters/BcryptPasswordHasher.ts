import bcrypt from 'bcrypt';
import { injectable } from "tsyringe";
import { PasswordHasher } from "application/security/PasswordHasher";

@injectable()
export class BcryptPasswordHasher implements PasswordHasher {

  async hash(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async verify(password: string, hashedPassword: string): Promise<Boolean> {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch
  }

}
