import type { IAuthService } from "@/domain/services/auth-service/IAuthService";
import { useEffect } from "react";
import { inject, injectable } from "tsyringe";

@injectable()
export class HomeController {

  constructor(
    @inject('AuthService') private readonly authService: IAuthService
  ) { }


  deplay(seconds: number) {
    return new Promise<void>((resolve) => {
      setTimeout(() => { resolve() }, seconds * 1000)
    })
  }

  use() {

    useEffect(() => {
      (async () => {
        for (let i = 1; i <= 10; i++) {
          await this.deplay(1)
          const user = await this.authService.getProfile()
          console.log(`request: (${i})`, user)
        }

        await this.deplay(10)
        const user = await this.authService.getProfile()
        console.log(`request: (${11})`, user)

      })()
    }, [])

  }

} 