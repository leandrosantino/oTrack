import { container } from "tsyringe";
import { AuthController } from "controllers/AuthController";
import { AuthMiddleware } from "middlewares/AuthMiddleware";
import { LocationSharingController } from "controllers/LocationSharingController";
import { UserRepository } from "repository/UserRepository";
import { UsersController } from "controllers/UsersController";

import { Err, Ok } from 'utils/ResultHandler'
import { Properties } from "utils/Properties";
import { PasswordHasher } from "services/PasswordHasher/PasswordHasher";
import { ErrorMiddleware } from "middlewares/ErrorMiddleware";
import { JsonWebTokenProvider } from "services/TokenProvider/JsonWebTokenProvider";
import { LocalLogger } from "utils/LocalLogger";
import { ServiceOrderRepository } from "repository/ServiceOrderRepository";
import { ServiceOrdersController } from "controllers/ServiceOrdersController";
import { CreateServiceOrder } from "use-cases/service-order/CreateServiceOrder";
import { ListServiceOrders } from "use-cases/service-order/ListServiceOrders";
import { RealtimeServiceOrderController } from "controllers/RealtimeServiceOrderController";
import { UpdateServiceOrder } from "use-cases/service-order/UpdateServiceOrder";
import { UpdateServiceOrderKanbanPosition } from "use-cases/service-order/UpdateServiceOrderKanbanPosition";
import { CreateServiceOrderObservable } from "use-cases/service-order/wrappers/CreateServiceOrderObservable";
import { WebSocketAuthMiddleware } from "middlewares/WebSocketAuthMiddleware";
import { Observer } from "utils/Observer";
import { CreateUser } from "use-cases/user/CreateUser";
import { RefreshTokens } from "use-cases/authentication/RefreshTokens";
import { SignIn } from "use-cases/authentication/SignIn";
import { SignOut } from "use-cases/authentication/SignOut";
import { VerifyToken } from "use-cases/authentication/VerifyToken";
import { UserProfileValidator } from "entities/user/validators/UserProfileValidator";
import { UpdateKanbanPositionValidator } from "entities/service-order/validators/UpdateKanbanPositionValidator";
import { GenerateTicket } from "use-cases/authentication/GenerateTicket";
import { VerifyTicket } from "use-cases/authentication/VerifyTicket";
import { CuidGenerator } from "services/CuidGenerator/CuidGenerator";

(globalThis as any).Ok = Ok;
(globalThis as any).Err = Err;

container.register('AuthMiddleware', AuthMiddleware)
container.register('WebSocketAuthMiddleware', WebSocketAuthMiddleware)

container.register('UserRepository', UserRepository)
container.register('ServiceOrderRepository', ServiceOrderRepository)

container.registerSingleton('RefreshTokens', RefreshTokens)
container.registerSingleton('SignIn', SignIn)
container.registerSingleton('SignOut', SignOut)
container.registerSingleton('VerifyToken', VerifyToken)
container.registerSingleton('GenerateTicket', GenerateTicket)
container.registerSingleton('VerifyTicket', VerifyTicket)
container.registerSingleton('TicketsMap', Map)


container.registerSingleton('CreateUser', CreateUser)
container.register('PasswordHasher', PasswordHasher)
container.register('TokenProvider', JsonWebTokenProvider)
container.registerSingleton('CuidGenerator', CuidGenerator)

container.registerSingleton('CreateServiceOrder', CreateServiceOrder)
container.registerSingleton('CreateServiceOrderObservable', CreateServiceOrderObservable)
container.registerSingleton('UpdateServiceOrder', UpdateServiceOrder)
container.registerSingleton('UpdateServiceOrderKanbanPosition', UpdateServiceOrderKanbanPosition)
container.registerSingleton('ListServiceOrders', ListServiceOrders)

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
