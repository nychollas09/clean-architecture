import { FacebookApi } from '@/infrastructure/apis'
import { env } from '@/main/config/env'
import { makeAxiosHttpClient } from '../http'

export const makeFacebookApi = (): FacebookApi =>
  new FacebookApi(
    makeAxiosHttpClient(),
    env.facebookApi.clientId,
    env.facebookApi.clientSecret
  )
