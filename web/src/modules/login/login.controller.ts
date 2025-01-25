import { useAuth } from "@/contexts/authContext";
import type { IAuthService } from "@/domain/services/auth-service/IAuthService";
import { useState } from "react";
import { inject, injectable } from "tsyringe";

@injectable()
export class LoginController {

  constructor (
    @inject('AuthService') private readonly authService: IAuthService
  ) {}

  use() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const { setUser } = useAuth()

    const handleLogin = async () => {
      const userData = await this.authService.login(username, password)
      if(userData){
        setUser(userData)
      }
    }

    return {
      usernameField: {value: username, set: setUsername},
      passwordField: {value: password, set: setPassword},
      handleLogin
    }

  }
}