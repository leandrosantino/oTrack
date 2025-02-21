import { AsyncResult } from "interfaces/Result";
import { User } from "entities/user/User"
import { UserToken } from "entities/user/UserToken";
import { TokenException } from "services/JwtService/TokenException";
import { SignInException } from "entities/user/exceptions/SignInException";

export interface IAuthService {
  signIn(authData: AuthRequestDTO): AsyncResult<AuthResponseDTO, SignInException>
  signOut(refreshToken: JwtToken): Promise<void>
  verifyToken(token: JwtToken): AsyncResult<UserProfile, TokenException>
  refreshTokens(refreshToken: JwtToken): AsyncResult<AuthResponseDTO, TokenException>
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
