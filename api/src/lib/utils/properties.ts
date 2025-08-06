import z from "zod"
import Dotenv from 'dotenv'
Dotenv.config()

const envSchema = z.object({
  JWT_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES: z.string(),
  REFRESH_TOKEN_EXPIRES: z.string(),
  COOKIE_SECRET: z.string(),
  CORS_ORIGINS: z.string(),
  MAIL_SERVICE_API_KEY: z.string(),
  WEB_APP_ENDPOINT: z.string(),
  WEB_APP_PASSWORD_RESET_ROUTE: z.string(),
  REDIS_PASSWORD: z.string(),
  WEBSOCKET_TICKET_TTL: z.string().transform(val => Number(val))
})
export type Properties = z.infer<typeof envSchema>

const { error, data } = envSchema.safeParse(process.env)

if (error) throw new Error('invalid enviroment variables');

(globalThis as any).properties = data;


