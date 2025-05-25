import { container } from "tsyringe";
import { ResetPasswordController } from "./reset-password.controller";
import { ResetPasswordView } from "./reset-password.view";

export function ResetPassword() {
  const controller = container.resolve(ResetPasswordController)
  return ResetPasswordView({ controller })
}