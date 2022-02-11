import { AuthenticationException } from '@/domain/exceptions'
import { ServerException } from '../exceptions'

export type HttpResponse<T = any> = {
  statusCode: number
  data: T
}

export const badRequest = (error: Error): HttpResponse<typeof error> => ({
  statusCode: 400,
  data: error
})

export const unathorizedRequest = (
  error: AuthenticationException
): HttpResponse<typeof error> => ({
  statusCode: 401,
  data: error
})

export const serverErrorRequest = (
  error: ServerException
): HttpResponse<typeof error> => ({
  statusCode: 500,
  data: error
})

export const succeedRequest = <T>(data: T): HttpResponse<typeof data> => ({
  statusCode: 200,
  data
})
