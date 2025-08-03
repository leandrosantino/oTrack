import bcrypt from 'bcrypt';
import { PasswordHasher } from "./PasswordHasher";
import { Injectable } from '@nestjs/common';

@Injectable()
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
