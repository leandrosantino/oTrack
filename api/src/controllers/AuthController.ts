import Elysia, { t } from "elysia";
import { authController } from "factory";
import { AuthMiddleware } from "middlewares/AuthMiddleware";
import { IAuthService } from "services/AuthService/IAuthService";
import { inject, injectable } from "tsyringe";

@injectable()
export class AuthController {

  constructor(
    @inject('AuthService') private readonly authService: IAuthService,
    @inject('AuthMiddleware') private readonly authMiddleware: AuthMiddleware,
  ) { }

  private bodySchema = t.Object({
    username: t.String(),
    password: t.String()
  })

  build(baseUrl: string = '') {
    return new Elysia()
      .use(this.authMiddleware.build('ADMIN'))
      .post(`${baseUrl}/signin`, ({ body, bearer }) => {
        console.log(bearer)
        return this.authService.signIn(body)
      }, { body: this.bodySchema })
  }

}
