import { User } from "user/entities/User"
import { UserToken } from "user/dto/UserToken"

export type RefreshTokenData = {
  id: UserToken['id']
  userId: User['id']
}
