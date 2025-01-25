import { container } from "tsyringe";
import { LoginView } from "./login-view";
import { LoginController } from "./login.controller";


const controller = container.resolve(LoginController)
export const Login = () => LoginView({ controller })