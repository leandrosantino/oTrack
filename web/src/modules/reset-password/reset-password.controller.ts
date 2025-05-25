import type { IAuthService } from "@/domain/services/auth-service/IAuthService";
import { useStateObject } from "@/lib/useStateObject";
import { useEffect } from "react";
import { useParams } from "react-router";
import { inject, injectable } from "tsyringe";

@injectable()
export class ResetPasswordController {

  isLoadingSession = useStateObject(false)
  ticketIsValid = useStateObject(false)
  showPassword = useStateObject(false)
  password = useStateObject('')
  passwordError = useStateObject('')

  ticket!: string

  constructor(
    @inject('AuthService') private readonly authService: IAuthService
  ) {
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