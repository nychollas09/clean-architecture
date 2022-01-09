import { AuthenticationException } from '@/domain/exceptions'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import {
  LoadUserAccountRepository,
  CreateFacebookAccountRepository
} from '../contracts/repositories'

export class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly createFacebookAccountRepository: CreateFacebookAccountRepository
  ) {}

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationException> {
    const fbData = await this.loadFacebookUserApi.loadUser(params)

    if (fbData !== undefined) {
      await this.loadUserAccountRepository.load({
        email: fbData.email
      })

      await this.createFacebookAccountRepository.createFromFacebook(fbData)
    }

    return new AuthenticationException()
  }
}
