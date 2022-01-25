import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationException } from '@/domain/exceptions'
import { FacebookAuthentication } from '@/domain/features'
import { FacebookAccount } from '@/domain/models'
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository
} from '../contracts/repositories'

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly accountRepository: LoadUserAccountRepository &
      SaveFacebookAccountRepository
  ) {}

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationException> {
    const fbData = await this.facebookApi.loadUser(params)

    if (fbData !== undefined) {
      const userAccountData = await this.accountRepository.load({
        email: fbData.email
      })

      const facebookAccount = new FacebookAccount(fbData, userAccountData)

      await this.accountRepository.saveWithFacebook(facebookAccount)
    }

    return new AuthenticationException()
  }
}
