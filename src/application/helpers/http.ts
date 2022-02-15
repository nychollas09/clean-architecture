import { ServerException, UnathorizedException } from '../exceptions'

export type HttpResponse<T = any> = {
  statusCode: number
  data: T
}

export const badRequest = (error: Error): HttpResponse<typeof error> => ({
  statusCode: 400,
  data: error
})

export const unathorizedRequest = (): HttpResponse<UnathorizedException> => ({
  statusCode: 401,
  data: new UnathorizedException()
})

export const serverErrorRequest = (
  error: Error
): HttpResponse<typeof error> => ({
  statusCode: 500,
  data: new ServerException(error)
})

export const succeedRequest = <T>(data: T): HttpResponse<typeof data> => ({
  statusCode: 200,
  data
})
