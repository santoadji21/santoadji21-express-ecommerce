import dotenv from 'dotenv'
import bunyan from 'bunyan'
import { z, ZodError } from 'zod'

dotenv.config({})

const EnvSchema = z.object({
  SERVER_PORT: z.string().optional(),
  MONGO_URI: z.string(),
  JWT_SECRET: z.string(),
  NODE_ENV: z.string().optional(),
  SECRET_KEY_ONE: z.string(),
  SECRET_KEY_TWO: z.string(),
  CLIENT_URL: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string().optional(),
  REDIS_PASSWORD: z.string(),
})

class Config {
  public readonly SERVER_PORT: number
  public readonly MONGO_URI: string
  public readonly JWT_SECRET: string
  public readonly NODE_ENV: string
  public readonly SECRET_KEY_ONE: string
  public readonly SECRET_KEY_TWO: string
  public readonly CLIENT_URL: string
  public readonly REDIS_HOST: string
  public readonly REDIS_PORT: number
  public readonly REDIS_PASSWORD: string

  constructor() {
    try {
      const env = EnvSchema.parse(process.env)

      this.SERVER_PORT = Number(env.SERVER_PORT) || 5000
      this.MONGO_URI = env.MONGO_URI
      this.JWT_SECRET = env.JWT_SECRET
      this.NODE_ENV = (env.NODE_ENV || '').toLowerCase()
      this.SECRET_KEY_ONE = env.SECRET_KEY_ONE
      this.SECRET_KEY_TWO = env.SECRET_KEY_TWO
      this.CLIENT_URL = env.CLIENT_URL
      this.REDIS_HOST = env.REDIS_HOST
      this.REDIS_PORT = Number(env.REDIS_PORT) || 6379
      this.REDIS_PASSWORD = env.REDIS_PASSWORD
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(`Missing or invalid config value: ${error.message}`)
      }
      throw error
    }
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug' })
  }
}

export const config: Config = new Config()
