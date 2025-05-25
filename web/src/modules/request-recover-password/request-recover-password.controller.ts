import type { IAuthService } from "@/domain/services/auth-service/IAuthService";
import { useStateObject } from "@/lib/useStateObject";
import { inject, injectable } from "tsyringe";

@injectable()
export class RequestRecoverPasswordController {

  isLoadingSession = useStateObject(false)
  email = useStateObject('')
  makeRequest = useStateObject(false)

  constructor(
    @inject('AuthService') private readonly authService: IAuthService
  ) { }

  async handleRqeust() {
    if (this.email.value == '') return
    this.makeRequest.set(true)
    this.authService.requestRecoiverPasswordEmail(this.email.value)
  }

}