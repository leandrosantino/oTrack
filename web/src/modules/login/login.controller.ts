import { useAuth } from "@/contexts/authContext";
import type { IAuthService } from "@/domain/services/auth-service/IAuthService";
import { useEffect, useState } from "react";
import { inject, injectable } from "tsyringe";

@injectable()
export class LoginController {

  constructor(
    @inject('AuthService') private readonly authService: IAuthService
  ) { }

  use() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [isLoadingSession, setIsLoadingSession] = useState(false)

    const { setUser } = useAuth()

    useEffect(() => {
      restoreSession()
    }, [])

    useEffect(() => {
      this.authService.setOnExpiresToken(() => { setUser(null) })
    }, [])

    const restoreSession = async () => {
      setIsLoadingSession(true)
      try {
        await this.authService.refreshToken()
        await setUserProfile()
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoadingSession(false)
      }
    }

    const handleLogin = async () => {
      try {
        await this.authService.login(username, password)
        await setUserProfile()
      } catch (err) {
        console.log(err)
      }
    }

    const setUserProfile = async () => {
      const userData = await this.authService.getProfile()
      if (userData) {
        setUser(userData)
      }
    }

    return {
      usernameField: { value: username, set: setUsername },
      passwordField: { value: password, set: setPassword },
      handleLogin,
      isLoadingSession
    }

  }
}