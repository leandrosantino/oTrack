import { AuthRequestDTO, JwtToken, TokenData } from "./IAuthServiceDTO";

export interface IAuthService {
  signIn(authData: AuthRequestDTO): JwtToken
  verifiyToken(token: JwtToken): TokenData
}
