import type { IAuthService } from "@/domain/services/auth-service/IAuthService";
import { component } from "@/lib/@component";
import { ComponentController } from "@/lib/ComponentController";
import { ComponentView } from "@/lib/ComponentView";
import { inject } from "tsyringe";
import { RequestRecoverPasswordView } from "./request-recover-password.view";

@component(RequestRecoverPasswordView)
export class RequestRecoverPassword extends ComponentController {

  isLoadingSession = this.useState(false)
  email = this.useState('')
  makeRequest = this.useState(false)

  constructor(
    @inject('AuthService') private readonly authService: IAuthService
  ) { super() }

  async handleRqeust() {
    if (this.email.value == '') return
    this.makeRequest.set(true)
    this.authService.requestRecoiverPasswordEmail(this.email.value)
  }

}

export default RequestRecoverPassword.View as ComponentView<RequestRecoverPassword>