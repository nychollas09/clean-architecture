import { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { Controller } from '@/application/controllers'
import { mock, MockProxy } from 'jest-mock-extended'

export class ExpressRouterAdapter {
  constructor(private readonly controller: Controller) {}

  public async adapt(request: Request, response: Response): Promise<void> {
    const httpResponse = await this.controller.handle(request.body)

    response
      .status(httpResponse.statusCode)
      .json(
        httpResponse.data instanceof Error
          ? { error: httpResponse.data.message }
          : httpResponse.data
      )
  }
}

describe('ExpressRouterAdapter', () => {
  let sut: ExpressRouterAdapter
  let controller: MockProxy<Controller>

  beforeEach(() => {
    controller = mock<Controller>()
    controller.handle.mockResolvedValue({
      statusCode: 200,
      data: {
        data: 'any_data'
      }
    })

    sut = new ExpressRouterAdapter(controller)
  })

  it('Should call handle with correct request', async () => {
    const request = getMockReq({ body: { any: 'any' } })
    const response = getMockRes().res

    await sut.adapt(request, response)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  it('Should call handle with empty request', async () => {
    const request = getMockReq()
    const response = getMockRes().res

    await sut.adapt(request, response)

    expect(controller.handle).toHaveBeenCalledWith({})
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  it('Should respond with 200 and valid data', async () => {
    const request = getMockReq()
    const response = getMockRes().res

    await sut.adapt(request, response)

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
    const response = getMockRes().res

    await sut.adapt(request, response)

    expect(response.status).toHaveBeenCalledWith(error.statusCode)
    expect(response.json).toHaveBeenCalledWith({
      error: error.data.message
    })
    expect(response.status).toHaveBeenCalledTimes(1)
    expect(response.json).toHaveBeenCalledTimes(1)
  })
})
