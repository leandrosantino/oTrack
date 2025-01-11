import { EntityRepository } from "entities/types/EntityRepository";
import { User } from "entities/user/User";

export interface IUserRepository extends EntityRepository<User, User['id']> {
  getByUsername(username: User['username']): Promise<User | null>
}
