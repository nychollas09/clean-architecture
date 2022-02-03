import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { HttpClient } from '../http'

export class FacebookApi implements LoadFacebookUserApi {
  private readonly baseUrl = 'https://graph.facebook.com'

  constructor(
    private readonly httpClient: HttpClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser(
    params: LoadFacebookUserApi.Params
  ): Promise<LoadFacebookUserApi.Result> {
    const { access_token: appToken } = await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      queryParams: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })

    await this.httpClient.get({
      url: `${this.baseUrl}/debug_token`,
      queryParams: {
        access_token: appToken,
        input_token: params.token
      }
    })

    return undefined
  }
}
