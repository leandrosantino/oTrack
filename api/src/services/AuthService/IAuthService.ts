import { AuthRequestDTO, JwtToken, TokenData } from "./IAuthServiceDTO";

export interface IAuthService {
  signIn(authData: AuthRequestDTO): Promise<JwtToken>
  verifyToken(token: JwtToken): Promise<TokenData>
}
