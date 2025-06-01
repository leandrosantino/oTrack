import type { IAuthService } from "@/domain/services/auth-service/IAuthService";
import { component } from "@/lib/@component";
import { ComponentController } from "@/lib/ComponentController";
import { ComponentView } from "@/lib/ComponentView";
import { useEffect } from "react";
import { useParams } from "react-router";
import { inject } from "tsyringe";
import { ResetPasswordView } from "./reset-password.view";

@component(ResetPasswordView)
export class ResetPassword extends ComponentController {

  isLoadingSession = this.useState(false)
  ticketIsValid = this.useState(false)
  showPassword = this.useState(false)
  password = this.useState('')
  passwordError = this.useState('')

  ticket!: string

  constructor(
    @inject('AuthService') private readonly authService: IAuthService
  ) {
    super()
    const { ticket } = useParams()
    this.ticket = ticket || ''
    useEffect(() => {
      (async () => {
        const isValid = await this.authService.recoiverPasswordTicketIsValid(this.ticket)
        console.log('ticket is valid', isValid)
        this.ticketIsValid.set(isValid)
      })()
    }, [ticket])
  }

  async handleRqeust() {
    if (this.password.value == '') return
    await this.authService.updatePassword(this.ticket, this.password.value)
  }

}

export default ResetPassword.View as ComponentView<ResetPassword>