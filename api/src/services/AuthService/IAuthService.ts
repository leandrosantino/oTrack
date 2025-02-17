import { AsyncResult } from "interfaces/Result";
import { SignInExceptions } from "./AuthExceptions";
import { User } from "entities/user/User"
import { UserToken } from "entities/user/UserToken";
import { TokenExceptions } from "services/JwtService/TokenExceptions";

export interface IAuthService {
  signIn(authData: AuthRequestDTO): AsyncResult<AuthResponseDTO, SignInExceptions>
  signOut(refreshToken: JwtToken): Promise<void>
  verifyToken(token: JwtToken): AsyncResult<UserProfile, TokenExceptions>
  refreshTokens(refreshToken: JwtToken): AsyncResult<AuthResponseDTO, TokenExceptions>
}

export type AuthRequestDTO = {
  username: string
  password: string
}

export type AuthResponseDTO = {
  accessToken: JwtToken
  refreshToken: JwtToken
}

export type JwtToken = string

export type UserProfile = Pick<User, 'id' | 'displayName' | 'username' | 'roule'>
export type RefreshTokenData = {
  id: UserToken['id']
  userId: User['id']
}
