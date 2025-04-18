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
    CORS_ORIGINS: z.string()
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
