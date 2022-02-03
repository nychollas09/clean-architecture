import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { HttpClient } from '../http'

type AppToken = {
  access_token: string
}

type DebugToken = {
  data: {
    user_id: string
  }
}

type UserInfo = {
  id: string
  name: string
  email: string
}

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
    const { id, name, email } = await this.userInfo(params.token)

    return {
      facebookId: id,
      name,
      email
    }
  }

  private async getAppToken(): Promise<AppToken> {
    return this.httpClient.get<AppToken>({
      url: `${this.baseUrl}/oauth/access_token`,
      queryParams: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }

  private async getDebugToken(clientToken: string): Promise<DebugToken> {
    const { access_token: appToken } = await this.getAppToken()

    return this.httpClient.get<DebugToken>({
      url: `${this.baseUrl}/debug_token`,
      queryParams: {
        access_token: appToken,
        input_token: clientToken
      }
    })
  }

  private async userInfo(clientToken: string): Promise<UserInfo> {
    const {
      data: { user_id: userId }
    } = await this.getDebugToken(clientToken)

    return this.httpClient.get<UserInfo>({
      url: `${this.baseUrl}/${userId}`,
      queryParams: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken
      }
    })
  }
}
