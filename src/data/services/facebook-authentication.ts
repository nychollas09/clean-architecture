import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationException } from '@/domain/exceptions'
import { FacebookAuthentication } from '@/domain/features'
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
  UpdateFacebookAccountRepository
} from '../contracts/repositories'

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly accountRepository: LoadUserAccountRepository &
      CreateFacebookAccountRepository &
      UpdateFacebookAccountRepository
  ) {}

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationException> {
    const fbData = await this.facebookApi.loadUser(params)

    if (fbData !== undefined) {
      const userAccountData = await this.accountRepository.load({
        email: fbData.email
      })

      if (userAccountData !== undefined) {
        await this.accountRepository.updateWithFacebook({
          id: userAccountData.id,
          name: userAccountData.name ?? fbData.name,
          facebookId: fbData.facebookId
        })
      } else {
        await this.accountRepository.createFromFacebook(fbData)
      }
    }

    return new AuthenticationException()
  }
}
