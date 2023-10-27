/* eslint-disable @typescript-eslint/no-explicit-any */
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
