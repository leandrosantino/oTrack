import { container } from "tsyringe";
import { AuthService } from "./services/AuthService/AuthService";
import { AuthController } from "controllers/AuthController";
import { AuthMiddleware } from "middlewares/AuthMiddleware";
import { Properties } from "config/Properties";
import { WebSocketController } from "controllers/WebSocketController";
import { EventListener } from "utils/EventListener";

container.register('AuthMiddleware', AuthMiddleware)
container.register('Properties', Properties)
container.register('EventListener', EventListener)
container.register('AuthService', AuthService)

export const authController = container.resolve(AuthController)
export const webSocketController = container.resolve(WebSocketController)
