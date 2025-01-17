import { Roules } from "entities/user/Roule"
import { User } from "entities/user/User"

export type AuthRequestDTO = {
  username: string
  password: string
}

export type AuthResponseDTO = {
  accessToken: JwtToken
  refreshToken: JwtToken
}

export type JwtToken = string

export type AccessTokenData = Pick<User, 'id' | 'displayName' | 'username' | 'roule'>
export type RefreshTokenData = Pick<User, 'id'>
