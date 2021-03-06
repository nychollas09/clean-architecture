import { FacebookAuthenticationService } from '@/data/services'
import { makeFacebookApi } from '@/main/factories/apis'
import { makePostgresUserAccountRepository } from '@/main/factories/repositories/postgres/user-account'
import { makeJwtTokenGenerator } from '@/main/factories/crypto'

export const makeFacebookAuthenticationService =
  (): FacebookAuthenticationService => {
    return new FacebookAuthenticationService(
      makeFacebookApi(),
      makePostgresUserAccountRepository(),
      makeJwtTokenGenerator()
    )
  }
