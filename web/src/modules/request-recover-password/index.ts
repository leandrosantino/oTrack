import { container } from "tsyringe";
import { RequestRecoverPasswordController } from "./request-recover-password.controller";
import { RequestRecoverPasswordView } from "./request-recover-password.view";

export function RequestRecoverPassword() {
  const controller = container.resolve(RequestRecoverPasswordController)
  return RequestRecoverPasswordView({ controller })
}