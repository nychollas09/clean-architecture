import { FacebookLoginController } from '@/application/controllers'
import { UnathorizedException } from '@/application/exceptions'
import { RequiredStringValidator } from '@/application/validation'
import { AuthenticationException } from '@/domain/exceptions'
import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookLoginController', () => {
  let facebookAuth: MockProxy<FacebookAuthentication>
  let sut: FacebookLoginController
  let token: string

  beforeAll(() => {
    facebookAuth = mock<FacebookAuthentication>()
    facebookAuth.perform.mockResolvedValue(new AccessToken('any_value'))
    token = 'any_token'
  })

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth)
  })

  it('Should build Validators correctly', async () => {
    const validators = sut.buildValidators({ token })

    expect(validators).toEqual([
      new RequiredStringValidator('any_token', 'token')
    ])
  })

  it('Should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token })

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token })
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
  })

  it('Should return 401 if authentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationException())
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnathorizedException()
    })
  })

  it('Should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })
})
