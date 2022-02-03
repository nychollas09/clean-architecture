import { FacebookApi } from '@/infrastructure/apis'
import { HttpClient } from '@/infrastructure/http/client'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookApi', () => {
  let clientId: string
  let clientSecret: string
  let httpClient: MockProxy<HttpClient>
  let sut: FacebookApi

  beforeAll(() => {
    httpClient = mock<HttpClient>()
    clientId = 'any_client_id'
    clientSecret = 'any_client_secret'
  })

  beforeEach(() => {
    jest.clearAllMocks()
    httpClient.get
      .mockResolvedValueOnce({ access_token: 'any_app_token' })
      .mockResolvedValueOnce({ data: { user_id: 'any_user_id' } })
    sut = new FacebookApi(httpClient, clientId, clientSecret)
  })

  it('Should get App Token', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      queryParams: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    })
  })

  it('Should get Debug Token', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      queryParams: {
        access_token: 'any_app_token',
        input_token: 'any_client_token'
      }
    })
  })

  it('Should get User Info', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/any_user_id',
      queryParams: {
        fields: 'id,name,email',
        access_token: 'any_client_token'
      }
    })
  })
})
