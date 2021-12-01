import { AuthenticationException } from '@/domain/exceptions'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/api'

export class FacebookAuthenticationService {
  constructor(private readonly loadFacebookUserApi: LoadFacebookUserApi) {}

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationException> {
    await this.loadFacebookUserApi.loadUser(params)
    return new AuthenticationException()
  }
}
