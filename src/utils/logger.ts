// logger.ts
import bunyan from 'bunyan'
import { Request } from 'express'

class LoggerService {
  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug' })
  }
}

const loggerService = new LoggerService()
const logger = loggerService.createLogger('ProductController')

export function logInfo(message: string, req: Request) {
  const meta = {
    method: req.method,
    path: req.path,
    userId: req.user?.id,
    userEmail: req.user?.email,
  }
  logger.info({ ...meta }, message)
}

export function logError(message: string, req: Request, error: unknown) {
  const meta = {
    method: req.method,
    path: req.path,
    userId: req.user?.id,
    userEmail: req.user?.email,
  }
  logger.error({ ...meta, error }, message)
}

export default logger
