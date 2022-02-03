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
    const { access_token: appToken } = await this.httpClient.get<{
      access_token: string
    }>({
      url: `${this.baseUrl}/oauth/access_token`,
      queryParams: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })

    const {
      data: { user_id: userId }
    } = await this.httpClient.get<{ data: { user_id: string } }>({
      url: `${this.baseUrl}/debug_token`,
      queryParams: {
        access_token: appToken,
        input_token: params.token
      }
    })

    await this.httpClient.get<{
      access_token: string
    }>({
      url: `${this.baseUrl}/${userId}`,
      queryParams: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: params.token
      }
    })

    return undefined
  }
}
