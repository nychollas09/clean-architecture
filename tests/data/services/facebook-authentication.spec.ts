import { LoadFacebookUserApi } from '@/data/contracts/apis'
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository
} from '@/data/contracts/repositories'
import { FacebookAuthenticationService } from '@/data/services/facebook-authentication'
import { AuthenticationException } from '@/domain/exceptions'
import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: FacebookAuthenticationService
  facebookApi: MockProxy<LoadFacebookUserApi>
  accountRepository: MockProxy<
    LoadUserAccountRepository & SaveFacebookAccountRepository
  >
}

const makeSut = (): SutTypes => {
  const facebookApi = mock<LoadFacebookUserApi>()
  const accountRepository = mock<
    LoadUserAccountRepository & SaveFacebookAccountRepository
  >()

  const sut = new FacebookAuthenticationService(facebookApi, accountRepository)

  facebookApi.loadUser.mockResolvedValue({
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id'
  })

  accountRepository.load.mockResolvedValue(undefined)

  return {
    sut,
    facebookApi,
    accountRepository
  }
}

describe('FacebookAuthenticationService', () => {
  it('Should call LoadFacebookUserApi with correct params', async () => {
    const { sut, facebookApi } = makeSut()
    await sut.perform({ token: 'any_token' })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({
      token: 'any_token'
    })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationException when LoadFacebookUserApi returns undefined', async () => {
    const { sut, facebookApi } = makeSut()

    facebookApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationException())
  })

  it('Should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    const { sut, accountRepository } = makeSut()

    await sut.perform({ token: 'any_token' })

    expect(accountRepository.load).toHaveBeenCalledWith({
      email: 'any_fb_email'
    })
    expect(accountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('Should call SaveFacebookAccountRepository when LoadUserAccountRepository returns undefined', async () => {
    const { sut, accountRepository } = makeSut()

    await sut.perform({ token: 'any_token' })

    expect(accountRepository.saveWithFacebook).toHaveBeenCalledWith({
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id'
    })

    expect(accountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('Should call SaveFacebookAccountRepository when LoadUserAccountRepository returns data', async () => {
    const { sut, accountRepository } = makeSut()

    accountRepository.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name'
    })

    await sut.perform({ token: 'any_token' })

    expect(accountRepository.saveWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })

    expect(accountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('Should Update account name', async () => {
    const { sut, accountRepository } = makeSut()

    accountRepository.load.mockResolvedValueOnce({
      id: 'any_id'
    })

    await sut.perform({ token: 'any_token' })

    expect(accountRepository.saveWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })

    expect(accountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })
})
