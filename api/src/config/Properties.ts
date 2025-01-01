import { injectable } from "tsyringe"
import z from "zod"

@injectable()
export class Properties {

  private envSchema = z.object({
    JWT_SECRET: z.string(),
    TOKEN_EXPIRES: z.string()
  })

  public env = {} as z.infer<typeof this.envSchema>

  constructor() {
    try {
      this.env = this.envSchema.parse(process.env)
    } catch {
      console.log('invalid enviroment variables')
    }
  }

}
