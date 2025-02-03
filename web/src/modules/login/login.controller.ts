import { useAuth } from "@/contexts/authContext";
import type { IAuthService } from "@/domain/services/auth-service/IAuthService";
import { useStateObject } from "@/lib/useStateObject";
import { useEffect } from "react";
import { inject, injectable } from "tsyringe";

@injectable()
export class LoginController {

  private auth = useAuth()

  isLoadingSession = useStateObject(false)
  showPassword = useStateObject(false)
  username = useStateObject('')
  password = useStateObject('')
  usernameError = useStateObject('')
  passwordError = useStateObject('')

  constructor(
    @inject('AuthService') private readonly authService: IAuthService
  ) {
    useEffect(() => { this.restoreSession() }, [])

    useEffect(() => {
      this.authService.setOnExpiresToken(() => { this.auth.setUser(null) })
    }, [])

    useEffect(() => {
      this.usernameError.set('')
      this.passwordError.set('')
    }, [this.username.value, this.password.value])
  }

  async restoreSession() {
    this.isLoadingSession.set(true)
    try {
      await this.authService.refreshToken()
      await this.setUserProfile()
    } catch (err) {
      console.log(err)
    } finally {
      this.isLoadingSession.set(false)
    }
  }

  async setUserProfile() {
    const userData = await this.authService.getProfile()
    if (userData) {
      this.auth.setUser(userData)
    }
  }

  async handleLogin() {
    try {
      await this.authService.login(this.username.value, this.password.value)
      await this.setUserProfile()
    } catch (err) {
      const message = (err as Error).message
      if (message === 'USER_NOT_FOUND') this.usernameError.set('Usuário inválido')
      if (message === 'INVALID_PASSWORD') this.passwordError.set('Senha incorreta')
    }
  }

}