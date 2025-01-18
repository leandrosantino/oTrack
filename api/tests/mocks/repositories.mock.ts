import { IUserRepository } from "entities/user/IUserRepository";
import { mock, instance } from "ts-mockito";
import { Properties } from "utils/Properties";

// Mock dependencies
export const userRepositoryMock = mock<IUserRepository>()

