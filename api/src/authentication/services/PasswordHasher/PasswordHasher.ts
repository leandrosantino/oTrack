import bcrypt from 'bcrypt';
import { singleton } from "tsyringe";
import { IPasswordHasher } from "./IPasswordHasher";

@singleton()
export class PasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async verify(password: string, hashedPassword: string): Promise<Boolean> {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch
  }


}
