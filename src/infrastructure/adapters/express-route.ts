import { Controller } from '@/application/controllers'
import { RequestHandler } from 'express'

export const adaptExpressRoute = (controller: Controller): RequestHandler => {
  return async (request, response) => {
    const httpResponse = await controller.handle(request.body)

    response
      .status(httpResponse.statusCode)
      .json(
        httpResponse.data instanceof Error
          ? { error: httpResponse.data.message }
          : httpResponse.data
      )
  }
}
