import { User } from "user/User"
import { UserToken } from "user/UserToken"

export type AuthRequestDTO = {
  email: string
  password: string
}

export type SignInWithGoogleRequestDTO = {
  idToken: string
}

export type GoogleTokenInfo = {
  email: string
  email_verified: string
  name: string
  picture: string
  sub: string
}

export type AuthResponseDTO = {
  accessToken: string
  refreshToken: string
}

export type RefreshTokenData = {
  id: UserToken['id']
  userId: User['id']
}

export type SignUpRequestDTO = {
  email: string
  displayName: string
  password: string
}
