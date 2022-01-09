import { AuthenticationException } from '@/domain/exceptions'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository } from '../contracts/repositories'

export class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository
  ) {}

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationException> {
    const fbData = await this.loadFacebookUserApi.loadUser(params)

    if (fbData == null) {
      return new AuthenticationException()
    }

    await this.loadUserAccountRepository.load({ email: fbData.email })

    return new AuthenticationException()
  }
}
