import { Controller } from '@/application/controllers'
import { ServerException } from '@/application/exceptions'
import { HttpResponse } from '@/application/helpers'
import { ValidationComposite } from '@/application/validation'
import { mocked } from 'ts-jest/utils'

jest.mock('@/application/validation/composite')

class ControllerStub extends Controller {
  async perform(httpRequest: any): Promise<HttpResponse> {
    return { statusCode: 200, data: 'any_data' }
  }
}

describe('Controller', () => {
  let sut: ControllerStub

  beforeEach(() => {
    sut = new ControllerStub()
  })

  it('Should return 400 if validation fails', async () => {
    const error = new Error('validation_error')

    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))

    mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
    })

    expect(ValidationComposite).toHaveBeenCalledWith([])
  })

  it('Should return 500 if perform throws', async () => {
    const error = new Error('perform_error')
    jest.spyOn(sut, 'perform').mockRejectedValueOnce(new Error('perform_error'))

    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerException(error)
    })
  })

  it('Should return same result as perform', async () => {
    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: 'any_data'
    })
  })
})
