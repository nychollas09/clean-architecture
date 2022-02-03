import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { mock } from 'jest-mock-extended'

class FacebookApi implements LoadFacebookUserApi {
  private readonly baseUrl = 'https://graph.facebook.com'
  constructor(private readonly httpClient: HttpClient) {}

  async loadUser(
    params: LoadFacebookUserApi.Params
  ): Promise<LoadFacebookUserApi.Result> {
    await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`
    })
    return undefined
  }
}

namespace HttpClient {
  export type Params = { url: string }
  export type Result = undefined
}

interface HttpClient {
  get: (params: HttpClient.Params) => Promise<HttpClient.Result>
}

describe('FacebookApi', () => {
  it('Should get App Token', async () => {
    const httpClient = mock<HttpClient>()
    const sut = new FacebookApi(httpClient)

    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token'
    })
  })
})
