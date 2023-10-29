import { Request, Response } from 'express'
export interface ApiResponse<T = unknown> {
  data?: T
  error: boolean
  message: string
}

export function createResponse<T>(data: T, message: string = '', error: boolean = false): ApiResponse<T> {
  return { data, error, message }
}

export function createErrorResponse(message: string, data: unknown = null): ApiResponse {
  return createResponse(data, message, true)
}

export function notFoundErrorHandler(req: Request, res: Response) {
  res.status(404).json(createErrorResponse('Route not found', null))
}
