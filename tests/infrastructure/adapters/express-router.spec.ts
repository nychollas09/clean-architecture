import { getMockReq, getMockRes } from '@jest-mock/express'
import { Controller } from '@/application/controllers'
import { mock, MockProxy } from 'jest-mock-extended'
import { adaptExpressRoute } from '@/infrastructure/adapters/express-route'
import { RequestHandler } from 'express'

describe('ExpressRouterAdapter', () => {
  let sut: RequestHandler
  let controller: MockProxy<Controller>

  beforeEach(() => {
    controller = mock<Controller>()
    controller.handle.mockResolvedValue({
      statusCode: 200,
      data: {
        data: 'any_data'
      }
    })

    sut = adaptExpressRoute(controller)
  })

  it('Should call handle with correct request', () => {
    const request = getMockReq({ body: { any: 'any' } })
    const { res: response, next } = getMockRes()

    sut(request, response, next)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  it('Should call handle with empty request', async () => {
    const request = getMockReq()
    const { res: response, next } = getMockRes()

    await sut(request, response, next)

    expect(controller.handle).toHaveBeenCalledWith({})
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  it('Should respond with 200 and valid data', async () => {
    const request = getMockReq()
    const { res: response, next } = getMockRes()

    await sut(request, response, next)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith({
      data: 'any_data'
    })
    expect(response.status).toHaveBeenCalledTimes(1)
    expect(response.json).toHaveBeenCalledTimes(1)
  })

  it('Should respond valid error', async () => {
    const error = {
      statusCode: 400,
      data: new Error('any_error')
    }
    controller.handle.mockResolvedValueOnce(error)

    const request = getMockReq()
    const { res: response, next } = getMockRes()

    await sut(request, response, next)

    expect(response.status).toHaveBeenCalledWith(error.statusCode)
    expect(response.json).toHaveBeenCalledWith({
      error: error.data.message
    })
    expect(response.status).toHaveBeenCalledTimes(1)
    expect(response.json).toHaveBeenCalledTimes(1)
  })
})
