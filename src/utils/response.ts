/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from 'express'
export interface ApiResponse<T = any> {
  data?: T
  error: boolean
  message: string
}

export function createResponse<T>(data: T, message: string = '', error: boolean = false): ApiResponse<T> {
  return { data, error, message }
}

export function createErrorResponse(message: string, data: any = null): ApiResponse {
  return createResponse(data, message, true)
}

export function notFoundErrorHandler(req: Request, res: Response) {
  res.status(404).json(createErrorResponse('Route not found', null))
}
