import { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { Controller } from '@/application/controllers'
import { mock, MockProxy } from 'jest-mock-extended'

export class ExpressRouterAdapter {
  constructor(private readonly controller: Controller) {}

  public async adapt(request: Request, response: Response): Promise<void> {
    await this.controller.handle(request.body)
  }
}

describe('ExpressRouterAdapter', () => {
  let sut: ExpressRouterAdapter
  let controller: MockProxy<Controller>

  beforeAll(() => {
    controller = mock<Controller>()
  })

  beforeEach(() => {
    sut = new ExpressRouterAdapter(controller)
  })

  it('Should call handle with correct request', async () => {
    const request = getMockReq({ body: { any: 'any' } })
    const response = getMockRes().res

    await sut.adapt(request, response)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
  })
})
