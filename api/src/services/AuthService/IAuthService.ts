import { AuthRequestDTO, JwtToken, TokenData } from "./IAuthServiceDTO";

export interface IAuthService {
  signIn(authData: AuthRequestDTO): JwtToken
  verifyToken(token: JwtToken): Promise<TokenData>
}
