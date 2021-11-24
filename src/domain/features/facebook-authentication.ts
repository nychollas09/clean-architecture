import { AccessToken } from '@/domain/models'
import { AuthenticationException } from '@/domain/exceptions'

export interface FacebookAuthentication {
  perform: (
    params: FacebookAuthentication.Params
  ) => Promise<FacebookAuthentication.Result>
}

export namespace FacebookAuthentication {
  export type Params = {
    token: string
  }

  export type Result = AccessToken | AuthenticationException
}
