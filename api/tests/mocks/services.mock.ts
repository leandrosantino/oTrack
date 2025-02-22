import { IJwtService } from "domain/JwtAdapterInterface";
import { PasswordHasher } from "application/security/PasswordHasher";
import { mock } from "ts-mockito";

export const passwordHasherMock = mock<PasswordHasher>()

export const jwtServiceMock = mock<IJwtService>()
