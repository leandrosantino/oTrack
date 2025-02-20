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
import { ErrorMiddleware } from "middlewares/ErrorMiddleware";
import { JwtService } from "services/JwtService/JwtService";
import { LocalLogger } from "utils/LocalLogger";
import { LocationSharing } from "services/LocationSharing/LocationSharing";
import { ServiceOrderRepository } from "repository/ServiceOrderRepository";
import { ServiceOrdersController } from "controllers/ServiceOrdersController";
import { CreateServiceOrder } from "use-cases/service-order/CreateServiceOrder";
import { ListServiceOrders } from "use-cases/service-order/ListServiceOrders";
import { RealtimeServiceOrderService } from "services/RealtimeServiceOrderService/RealtimeServiceOrderService";
import { RealtimeServiceOrderController } from "controllers/RealtimeServiceOrderController";
import { UpdateServiceOrder } from "use-cases/service-order/UpdateServiceOrder";
import { UpdateServiceOrderKanbanPosition } from "use-cases/service-order/UpdateServiceOrderKanbanPosition";
import { CreateServiceOrderObservable } from "use-cases/service-order/wrappers/CreateServiceOrderObservable";
import { WebSocketAuthService } from "services/WebSocketAuthService.ts/WebSocketAuthService";
import { WebSocketAuthMiddleware } from "middlewares/WebSocketAuthMiddleware";
import { Observer } from "utils/Observer";
import { UpdateKanbanPositionValidator } from "services/RealtimeServiceOrderService/UpdateKanbanPositionValidator";
import { UserProfileValidator } from "services/AuthService/UserProfileValidator";
import { CreateUser } from "use-cases/user/CreateUser";

(globalThis as any).Ok = Ok;
(globalThis as any).Err = Err;

container.register('AuthMiddleware', AuthMiddleware)
container.register('WebSocketAuthMiddleware', WebSocketAuthMiddleware)

container.register('UserRepository', UserRepository)
container.register('ServiceOrderRepository', ServiceOrderRepository)

container.register('AuthService', AuthService)
container.registerSingleton('WebSocketAuthService', WebSocketAuthService)
container.registerSingleton('CreateUser', CreateUser)
container.register('PasswordHasher', PasswordHasher)
container.register('JwtService', JwtService)
container.register('LocationSharing', LocationSharing)

container.registerSingleton('CreateServiceOrder', CreateServiceOrder)
container.registerSingleton('CreateServiceOrderObservable', CreateServiceOrderObservable)
container.registerSingleton('UpdateServiceOrder', UpdateServiceOrder)
container.registerSingleton('UpdateServiceOrderKanbanPosition', UpdateServiceOrderKanbanPosition)
container.registerSingleton('ListServiceOrders', ListServiceOrders)
container.registerSingleton('RealtimeServiceOrderService', RealtimeServiceOrderService)

container.register('Logger', LocalLogger)
container.registerSingleton('CreateServiceOrderObserver', Observer)
container.registerSingleton('UpdateKanbanPositionValidator', UpdateKanbanPositionValidator)
container.registerSingleton('UserProfileValidator', UserProfileValidator)


export const properties = container.resolve(Properties)
container.registerInstance('Properties', properties)

export const errorMiddleware = container.resolve(ErrorMiddleware)

export const authController = container.resolve(AuthController)
export const usersController = container.resolve(UsersController)
export const locationSharingController = container.resolve(LocationSharingController)
export const serviceOrdersController = container.resolve(ServiceOrdersController)
export const realtimeServiceOrderController = container.resolve(RealtimeServiceOrderController)
