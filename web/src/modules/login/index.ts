import { container } from "tsyringe";
import { LoginView } from "./login-view";
import { LoginController } from "./login.controller";

export function Login() {
  const controller = container.resolve(LoginController)
  return LoginView({ controller })
}