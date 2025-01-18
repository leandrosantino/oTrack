import { User } from "./User"

export interface UserToken {
  id: number
  userId: number
  user: Omit<User, 'tokens'>
}
