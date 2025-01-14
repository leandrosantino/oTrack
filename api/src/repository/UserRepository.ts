import { prisma } from "database";
import { IUserRepository } from "entities/user/IUserRepository";
import { User } from "entities/user/User";
import { injectable } from "tsyringe";

@injectable()
export class UserRepository implements IUserRepository {

  async existsByUsername(username: User["username"]): Promise<Boolean> {
    const userExists = await prisma.users.findUnique({
      where: { username }
    })
    return userExists != null
  }

  async create(entity: Omit<User, "id">): Promise<User> {
    const user = await prisma.users.create({
      data: entity
    })
    return user as User
  }

  async getByUsername(username: User["username"]): Promise<User | null> {
    return await prisma.users.findUnique({
      where: { username }
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
