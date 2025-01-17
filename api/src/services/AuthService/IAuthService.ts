import { AsyncResult } from "interfaces/Result";
import { SignInExceptions, TokenExceptions } from "./AuthExceptions";
import { AuthRequestDTO, JwtToken, AccessTokenData, AuthResponseDTO } from "./IAuthServiceDTO";

export interface IAuthService {
  signIn(authData: AuthRequestDTO): AsyncResult<AuthResponseDTO, SignInExceptions>
  verifyToken(token: JwtToken): AsyncResult<AccessTokenData, TokenExceptions>
}
