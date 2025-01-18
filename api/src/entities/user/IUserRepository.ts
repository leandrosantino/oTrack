import { User } from "entities/user/User";
import { EntityRepository } from "interfaces/EntityRepository";
import { UserToken } from "./UserToken";

export interface IUserRepository extends EntityRepository<Omit<User, 'tokens'>, User['id']> {
  getByUsername(username: User['username']): Promise<Omit<User, 'tokens'> | null>
  existsByUsername(username: User['username']): Promise<Boolean>
  getTokenById(id: UserToken['id']): Promise<UserToken | null>
  deleteTokensByUserId(id: User['id']): Promise<boolean>
  deleteTokenById(id: UserToken['id']): Promise<boolean>
  createToken(userId: User['id']): Promise<Omit<UserToken, 'user'>>
}
