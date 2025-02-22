import { container } from "tsyringe";
import { AuthController } from "infra/controllers/AuthController";
import { AuthMiddleware } from "infra/middlewares/AuthMiddleware";
import { LocationSharingController } from "infra/controllers/LocationSharingController";
import { UserRepository } from "infra/repositories/UserRepository";
import { UsersController } from "infra/controllers/UsersController";

import { Properties } from "infra/Properties";
import { BcryptPasswordHasher } from "infra/adapters/BcryptPasswordHasher";
import { ErrorMiddleware } from "infra/middlewares/ErrorMiddleware";
import { LocalLogger } from "infra/adapters/LocalLogger";
import { LocationSharing } from "application/use-cases/user/LocationSharing";
import { ServiceOrderRepository } from "infra/repositories/ServiceOrderRepository";
import { ServiceOrdersController } from "infra/controllers/ServiceOrdersController";
import { CreateServiceOrder } from "application/use-cases/service-order/CreateServiceOrder";
import { ListServiceOrders } from "application/use-cases/service-order/ListServiceOrders";
import { RealtimeServiceOrderController } from "infra/controllers/RealtimeServiceOrderController";
import { UpdateServiceOrder } from "application/use-cases/service-order/UpdateServiceOrder";
import { UpdateServiceOrderKanbanPosition } from "application/use-cases/service-order/UpdateServiceOrderKanbanPosition";
import { CreateServiceOrderObservable } from "application/use-cases/service-order/wrappers/CreateServiceOrderObservable";
import { WebSocketAuthMiddleware } from "infra/middlewares/WebSocketAuthMiddleware";
import { Observer } from "application/events/Observer";
import { UpdateKanbanPositionValidator } from "application/validation/UpdateKanbanPositionValidator";
import { CreateUser } from "application/use-cases/user/CreateUser";
import { RefreshTokens } from "application/use-cases/authentication/RefreshTokens";
import { SignIn } from "application/use-cases/authentication/SignIn";
import { SignOut } from "application/use-cases/authentication/SignOut";
import { VerifyToken } from "application/use-cases/authentication/VerifyToken";
import { UserProfileValidator } from "application/validation/UserProfileValidator";
import { JwtProvider } from "infra/adapters/JwtProvider";
import { Ok, Err } from "domain/result/ResultHandler";
import { WebSocketAuthenticator } from "infra/websocket/WebSocketAuthenticator";
import { RealtimeSharingServiceOrder } from "application/use-cases/service-order/RealtimeSharingServiceOrder";

(globalThis as any).Ok = Ok;
(globalThis as any).Err = Err;

container.register('AuthMiddleware', AuthMiddleware)
container.register('WebSocketAuthMiddleware', WebSocketAuthMiddleware)

container.register('UserRepository', UserRepository)
container.register('ServiceOrderRepository', ServiceOrderRepository)

container.register('RefreshTokens', RefreshTokens)
container.register('SignIn', SignIn)
container.register('SignOut', SignOut)
container.register('VerifyToken', VerifyToken)

container.registerSingleton('WebSocketAuthService', WebSocketAuthenticator)
container.registerSingleton('CreateUser', CreateUser)
container.register('PasswordHasher', BcryptPasswordHasher)
container.register('JwtService', JwtProvider)
container.register('LocationSharing', LocationSharing)

container.registerSingleton('CreateServiceOrder', CreateServiceOrder)
container.registerSingleton('CreateServiceOrderObservable', CreateServiceOrderObservable)
container.registerSingleton('UpdateServiceOrder', UpdateServiceOrder)
container.registerSingleton('UpdateServiceOrderKanbanPosition', UpdateServiceOrderKanbanPosition)
container.registerSingleton('ListServiceOrders', ListServiceOrders)
container.registerSingleton('RealtimeServiceOrderService', RealtimeSharingServiceOrder)

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
