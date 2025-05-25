import { container } from "tsyringe";
import { LoginController } from "./login.controller";
import { LoginView } from "./login.view";

export function Login() {
  const controller = container.resolve(LoginController)
  return LoginView({ controller })
}