import type { IAuthService } from "@/domain/services/auth-service/IAuthService";
import { useEffect } from "react";
import { inject, injectable } from "tsyringe";

@injectable()
export class HomeController {

  constructor(
    @inject('AuthService') private readonly authService: IAuthService
  ) { }

  use() {

    useEffect(() => {

    }, [])

  }

} 