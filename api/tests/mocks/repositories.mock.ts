import { IUserRepository } from "entities/user/IUserRepository";
import { mock, instance } from "ts-mockito";
import { Properties } from "infra/Properties";

// Mock dependencies
export const userRepositoryMock = mock<IUserRepository>()

