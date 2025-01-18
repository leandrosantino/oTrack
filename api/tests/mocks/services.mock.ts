import { IPasswordHasher } from "services/PasswordHasher/IPasswordHasher";
import { mock } from "ts-mockito";

export const passwordHasherMock = mock<IPasswordHasher>()
