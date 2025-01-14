import { User } from "entities/user/User";
import { EntityRepository } from "interfaces/EntityRepository";

export interface IUserRepository extends EntityRepository<User, User['id']> {
  getByUsername(username: User['username']): Promise<User | null>
  existsByUsername(username: User['username']): Promise<Boolean>
}
