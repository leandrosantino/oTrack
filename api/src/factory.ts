import { container } from "tsyringe";
import { AuthService } from "./services/AuthService/AuthService";
import { AuthController } from "controllers/AuthController";
import { AuthMiddleware } from "middlewares/AuthMiddleware";
import { Properties } from "config/Properties";

container.register('AuthMiddleware', AuthMiddleware)
container.register('Properties', Properties)

export const authService = container.resolve(AuthService)
container.registerInstance('AuthService', authService)

export const authController = container.resolve(AuthController)
