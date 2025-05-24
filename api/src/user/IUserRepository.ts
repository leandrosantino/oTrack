import { UserToken } from "./UserToken";
import { User } from "./User";
import { EntityRepository } from "shared/interfaces/EntityRepository";

export interface IUserRepository extends EntityRepository<Omit<User, 'tokens'>, User['id']> {
  getByEmail(email: User['email']): Promise<Omit<User, 'tokens'> | null>
  existsByEmail(email: User['email']): Promise<Boolean>
  getTokenById(id: UserToken['id']): Promise<UserToken | null>
  deleteTokensByUserId(id: User['id']): Promise<boolean>
  deleteTokenById(id: UserToken['id']): Promise<boolean>
  createToken(userId: User['id']): Promise<Omit<UserToken, 'user'>>
}
