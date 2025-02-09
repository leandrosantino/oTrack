import { container } from "tsyringe";
import { AuthService } from "./services/AuthService/AuthService";
import { AuthController } from "controllers/AuthController";
import { AuthMiddleware } from "middlewares/AuthMiddleware";
import { LocationSharingController } from "controllers/LocationSharingController";
import { UserRepository } from "repository/UserRepository";
import { UsersController } from "controllers/UsersController";

import { Err, Ok } from 'utils/ResultHandler'
import { Properties } from "utils/Properties";
import { PasswordHasher } from "services/PasswordHasher/PasswordHasher";
import { UserService } from "services/UserService/UserService";
import { ErrorMiddleware } from "middlewares/ErrorMiddleware";
import { JwtService } from "services/JwtService/JwtService";
import { LocalLogger } from "utils/LocalLogger";
import { LocationSharing } from "services/LocationSharing/LocationSharing";
import { ServiceOrderRepository } from "repository/ServiceOrderRepository";
import { ServiceOrdersController } from "controllers/ServiceOrdersController";
import { CreateServiceOrder } from "use-cases/service-order/CreateServiceOrder";

(globalThis as any).Ok = Ok;
(globalThis as any).Err = Err;

container.register('AuthMiddleware', AuthMiddleware)

container.register('UserRepository', UserRepository)
container.register('ServiceOrderRepository', ServiceOrderRepository)

container.register('AuthService', AuthService)
container.register('UserService', UserService)
container.register('PasswordHasher', PasswordHasher)
container.register('JwtService', JwtService)
container.register('LocationSharing', LocationSharing)

container.registerSingleton('CreateServiceOrder', CreateServiceOrder);

container.register('Logger', LocalLogger)


export const properties = container.resolve(Properties)
container.registerInstance('Properties', properties)

export const errorMiddleware = container.resolve(ErrorMiddleware)

export const authController = container.resolve(AuthController)
export const usersController = container.resolve(UsersController)
export const locationSharingController = container.resolve(LocationSharingController)
export const serviceOrdersController = container.resolve(ServiceOrdersController)
