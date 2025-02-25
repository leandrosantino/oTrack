import { User } from "user/User"
import { UserToken } from "user/UserToken"

export type AuthRequestDTO = {
  username: string
  password: string
}

export type AuthResponseDTO = {
  accessToken: string
  refreshToken: string
}

export type RefreshTokenData = {
  id: UserToken['id']
  userId: User['id']
}
