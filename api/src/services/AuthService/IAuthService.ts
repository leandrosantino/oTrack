import { AsyncResult } from "interfaces/Result";
import { SignInExceptions, TokenExceptions } from "./AuthExceptions";
import { AuthRequestDTO, JwtToken, TokenData } from "./IAuthServiceDTO";

export interface IAuthService {
  signIn(authData: AuthRequestDTO): AsyncResult<JwtToken, SignInExceptions>
  verifyToken(token: JwtToken): AsyncResult<TokenData, TokenExceptions>
}
