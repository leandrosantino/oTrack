import { User } from "../entities/User"

export interface UserToken {
  id: number
  userId: number
  user: Omit<User, 'tokens'>
}
