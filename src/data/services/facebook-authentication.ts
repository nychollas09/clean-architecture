import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationException } from '@/domain/exceptions'
import { FacebookAuthentication } from '@/domain/features'
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository
} from '../contracts/repositories'

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly accountRepository: LoadUserAccountRepository &
      CreateFacebookAccountRepository
  ) {}

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationException> {
    const fbData = await this.facebookApi.loadUser(params)

    if (fbData !== undefined) {
      await this.accountRepository.load({
        email: fbData.email
      })

      await this.accountRepository.createFromFacebook(fbData)
    }

    return new AuthenticationException()
  }
}
