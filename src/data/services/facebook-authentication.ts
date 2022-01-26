import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationException } from '@/domain/exceptions'
import { FacebookAuthentication } from '@/domain/features'
import { AccessToken, FacebookAccount } from '@/domain/models'
import { TokenGenerator } from '../contracts/crypto'
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository
} from '../contracts/repositories'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly accountRepository: LoadUserAccountRepository &
      SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator
  ) {}

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<FacebookAuthentication.Result> {
    const fbData = await this.facebookApi.loadUser(params)

    if (fbData !== undefined) {
      const userAccountData = await this.accountRepository.load({
        email: fbData.email
      })

      const facebookAccount = new FacebookAccount(fbData, userAccountData)

      const { id } = await this.accountRepository.saveWithFacebook(
        facebookAccount
      )

      const token = await this.crypto.generateToken({
        key: id,
        expirationInMs: AccessToken.expirationInMs
      })

      return new AccessToken(token)
    }

    return new AuthenticationException()
  }
}
