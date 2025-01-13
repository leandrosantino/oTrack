import { ErrorTypes } from "entities/types/ErrorTypes";
import { AuthRequestDTO, JwtToken, TokenData } from "./IAuthServiceDTO";

export interface IAuthService {
  signIn(authData: AuthRequestDTO): Promise<Result<JwtToken, ErrorTypes.NOT_FOUND | ErrorTypes.VALIDATION_ERROR>>
  verifyToken(token: JwtToken): Promise<Result<TokenData, ErrorTypes.VALIDATION_ERROR>>
}
