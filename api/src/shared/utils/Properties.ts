import { singleton } from "tsyringe"
import z from "zod"
import Dotenv from 'dotenv'
Dotenv.config()


@singleton()
export class Properties {

  private envSchema = z.object({
    JWT_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRES: z.string(),
    REFRESH_TOKEN_EXPIRES: z.string(),
    COOKIE_SECRET: z.string(),
    CORS_ORIGINS: z.string(),
    MAIL_SERVICE_API_KEY: z.string(),
    WEB_APP_ENDPOINT: z.string(),
    WEB_APP_PASSWORD_RESET_ROUTE: z.string()
  })

  public env = {} as z.infer<typeof this.envSchema>
  //
  constructor() {
    try {
      this.env = this.envSchema.parse(process.env)
    } catch {
      throw new Error('invalid enviroment variables')
    }
  }

}
