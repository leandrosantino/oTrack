import { container } from "tsyringe";
import { WebSocketAuthMiddleware } from "authentication/middlewares/WebSocketAuthMiddleware";
import { LocalLogger } from "shared/Logging/LocalLogger";
import { AuthMiddleware } from "authentication/middlewares/AuthMiddleware";
import { ErrorMiddleware } from "shared/middlewares/ErrorMiddleware";
import { Properties } from "shared/utils/Properties";
import { AuthController } from "authentication/controllers/AuthController";
import { RealtimeServiceOrderController } from "service-order/controllers/RealtimeServiceOrderController";
import { ServiceOrdersController } from "service-order/controllers/ServiceOrdersController";
import { LocationSharingController } from "user/controllers/LocationSharingController";
import { UsersController } from "user/controllers/UsersController";
import { Ok, Err } from 'shared/Result/ResultHandler'

import 'authentication/factory'
import 'service-order/factory'
import 'user/factory'
import { RecoverPasswordController } from "authentication/controllers/RecoverPasswordController";
import { ResendMailService } from "shared/services/MailService/ResendMailService";

(globalThis as any).Ok = Ok;
(globalThis as any).Err = Err;

container.registerSingleton('Logger', LocalLogger)

//Services
container.registerSingleton('ResendMailService', ResendMailService)

export const properties = container.resolve(Properties)
container.registerInstance('Properties', properties)

container.register('AuthMiddleware', AuthMiddleware)
container.register('WebSocketAuthMiddleware', WebSocketAuthMiddleware)
export const errorMiddleware = container.resolve(ErrorMiddleware)

//Controllers
export const authController = container.resolve(AuthController)
export const serviceOrdersController = container.resolve(ServiceOrdersController)
export const realtimeServiceOrderController = container.resolve(RealtimeServiceOrderController)
export const usersController = container.resolve(UsersController)
export const locationSharingController = container.resolve(LocationSharingController)
export const recoverPasswordController = container.resolve(RecoverPasswordController)
