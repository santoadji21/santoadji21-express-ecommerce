import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { createErrorResponse } from '@root/utils/response'
import { config } from '@config/environment'

declare module 'express' {
  interface UserPayload {
    id: string
    email?: string
  }

  interface Request {
    user?: UserPayload
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json(createErrorResponse('Access denied, no token provided'))
  }
  try {
    // Verify the token
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload
    const { user } = decoded
    req.user = {
      id: user.id,
    }
    next()
  } catch (err) {
    return res.status(401).json(createErrorResponse('Access denied, invalid token'))
  }
}

export default authenticate
