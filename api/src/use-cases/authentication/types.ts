import { User } from "entities/user/User"
import { UserToken } from "entities/user/UserToken"

export type AuthRequestDTO = {
  username: string
  password: string
}

export type AuthResponseDTO = {
  accessToken: JwtToken
  refreshToken: JwtToken
}

export type JwtToken = string

export type RefreshTokenData = {
  id: UserToken['id']
  userId: User['id']
}
