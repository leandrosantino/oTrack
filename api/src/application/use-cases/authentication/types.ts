import { User } from "domain/entities/user/User"
import { UserToken } from "domain/entities/user/UserToken"


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
