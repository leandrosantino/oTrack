import { prisma } from "database";
import { singleton } from "tsyringe";
import { IUserRepository } from "user/IUserRepository";
import { User } from "user/User";
import { UserToken } from "user/UserToken";

@singleton()
export class UserRepository implements IUserRepository {

  async createToken(userId: User["id"]): Promise<Omit<UserToken, "user">> {
    const createdToken = await prisma.tokens.create({
      data: { userId }
    })
    return createdToken
  }

  async deleteTokenById(id: UserToken["id"]): Promise<boolean> {
    try {
      await prisma.tokens.delete({
        where: { id }
      })
      return true
    } catch {
      return false
    }
  }

  async deleteTokensByUserId(id: User["id"]): Promise<boolean> {
    try {
      await prisma.tokens.deleteMany({
        where: { userId: id }
      })
      return true
    } catch {
      return false
    }
  }

  async getTokenById(id: UserToken["id"]): Promise<UserToken | null> {
    const userToken = await prisma.tokens.findUnique({
      where: { id },
      include: { user: true }
    })
    return userToken as UserToken
  }

  async existsByEmail(email: User["email"]): Promise<Boolean> {
    const userExists = await prisma.users.findUnique({
      where: { email }
    })
    return userExists != null
  }

  async create(entity: Omit<User, 'id' | 'tokens'>): Promise<Omit<User, 'tokens'>> {
    const user = await prisma.users.create({
      data: entity
    })
    return user as Omit<User, 'tokens'>
  }

  async getByEmail(email: User["email"]): Promise<User | null> {
    return await prisma.users.findUnique({
      where: { email }
    }) as User
  }

  async update({ id, ...entity }: Omit<User, "tokens">): Promise<Omit<User, "tokens">> {
    return await prisma.users.update({
      where: { id },
      data: {
        ...entity
      }
    }) as User
  }

  exists(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getById(id: number): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  findMany(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }

}
