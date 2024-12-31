import { container } from "tsyringe";
import { AuthService } from "./services/AuthService/AuthService";
import { AuthController } from "controllers/AuthController";
import { AuthMiddleware } from "middlewares/AuthMiddleware";

container.register('AuthService', AuthService)
container.register('AuthMiddleware', AuthMiddleware)

export const authController = container.resolve(AuthController)
