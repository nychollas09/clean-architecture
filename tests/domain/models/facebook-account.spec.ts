import { FacebookAccount } from '@/domain/models'

const facebookAccountData = {
  name: 'any_fb_name',
  email: 'any_fb_email',
  facebookId: 'any_fb_id'
}

describe('FacebookAccount', () => {
  it('Should Create with facebook data only', () => {
    const sut = new FacebookAccount(facebookAccountData)

    expect(sut).toEqual(facebookAccountData)
  })

  it('Should update name if its empty', () => {
    const sut = new FacebookAccount(facebookAccountData, { id: 'any_id' })

    expect(sut).toEqual({
      id: 'any_id',
      ...facebookAccountData
    })
  })

  it('Should not update name if its not empty', () => {
    const sut = new FacebookAccount(facebookAccountData, {
      id: 'any_id',
      name: 'any_name'
    })

    expect(sut).toEqual({
      ...facebookAccountData,
      id: 'any_id',
      name: 'any_name'
    })
  })
})
