import { useAuth } from "@/contexts/authContext";
import type { IAuthService } from "@/domain/services/auth-service/IAuthService";
import { component } from "@/lib/@component";
import { ComponentController } from "@/lib/ComponentController";
import { ComponentView } from "@/lib/ComponentView";
import { useEffect } from "react";
import { inject } from "tsyringe";
import { LoginView } from "./login.view";

@component(LoginView)
export class Login extends ComponentController {

  private auth = useAuth()

  isLoadingSession = this.useState(false)
  showPassword = this.useState(false)
  password = this.useState('')
  username = this.useState('')
  usernameError = this.useState('')
  passwordError = this.useState('')

  constructor(
    @inject('AuthService') private readonly authService: IAuthService
  ) {
    super()
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

export default Login.View as ComponentView<Login>;