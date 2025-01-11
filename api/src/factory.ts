import { container } from "tsyringe";
import { AuthService } from "./services/AuthService/AuthService";
import { AuthController } from "controllers/AuthController";
import { AuthMiddleware } from "middlewares/AuthMiddleware";
import { Properties } from "config/Properties";
import { WebSocketController } from "controllers/WebSocketController";
import { EventListener } from "utils/EventListener";
import { UserRepository } from "repository/UserRepository";

container.register('AuthMiddleware', AuthMiddleware)
container.register('EventListener', EventListener)
container.register('Properties', Properties)

container.register('AuthService', AuthService)
container.register('UserRepository', UserRepository)



export const authController = container.resolve(AuthController)
export const webSocketController = container.resolve(WebSocketController)
