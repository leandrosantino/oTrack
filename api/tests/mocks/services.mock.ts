import { ITokenProvider } from "services/TokenProvider/ITokenProvider";
import { IPasswordHasher } from "services/PasswordHasher/IPasswordHasher";
import { mock } from "ts-mockito";

export const passwordHasherMock = mock<IPasswordHasher>()

export const jwtServiceMock = mock<ITokenProvider>()
