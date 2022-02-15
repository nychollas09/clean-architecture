import { FacebookApi } from '@/infrastructure/apis'
import { AxiosHttpClient } from '@/infrastructure/http'
import { env } from '@/main/config/env'

describe('Facebook Api Integration Tests', () => {
  let sut: FacebookApi
  let axiosClient: AxiosHttpClient

  beforeAll(() => {
    axiosClient = new AxiosHttpClient()
  })

  beforeEach(() => {
    sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    )
  })

  it('Should return a Facebook User if token is valid', async () => {
    const fbUser = await sut.loadUser({
      token:
        'EAAEeHSXQ8AIBAFo3JDbuZAsb1pGONjaZAX1ye2GFqjJ9ZBvYbewVLFfgVk7ypewizBLzKvbHMoH0xQ7ClHCsoCjEVlvnozJfZBRbixZBQAS8OGZCM38b9NVyZAyH5pJFJsgexpKUEXcNkqbaDizZCOvxcHjCbiZBKrjjzEbUCX5tBA6JC0i2mcXcJ5EJSn2ZAl3FFU2kqrym1g9gZDZD'
    })

    expect(fbUser).toEqual({
      facebookId: '107487971864900',
      email: 'nick_gfgadxv_teste@tfbnw.net',
      name: 'Nick Teste'
    })
  })

  it('Should return undefined if token is invalid', async () => {
    const fbUser = await sut.loadUser({
      token: 'invalid'
    })

    expect(fbUser).toBeUndefined()
  })
})
