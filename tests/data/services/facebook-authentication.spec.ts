import { LoadFacebookUserApi } from '@/data/contracts/apis'
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository
} from '@/data/contracts/repositories'
import { TokenGenerator } from '@/data/contracts/crypto'
import { FacebookAuthenticationService } from '@/data/services/facebook-authentication'
import { AuthenticationException } from '@/domain/exceptions'
import { AccessToken, FacebookAccount } from '@/domain/models'
import { mock, MockProxy } from 'jest-mock-extended'
import { mocked } from 'ts-jest/utils'

jest.mock('@/domain/models/facebook-account')

type SutTypes = {
  sut: FacebookAuthenticationService
  facebookApi: MockProxy<LoadFacebookUserApi>
  accountRepository: MockProxy<
    LoadUserAccountRepository & SaveFacebookAccountRepository
  >
  crypto: MockProxy<TokenGenerator>
}

const makeSut = (): SutTypes => {
  const facebookApi = mock<LoadFacebookUserApi>()
  const accountRepository = mock<
    LoadUserAccountRepository & SaveFacebookAccountRepository
  >()
  const crypto = mock<TokenGenerator>()

  const sut = new FacebookAuthenticationService(
    facebookApi,
    accountRepository,
    crypto
  )

  facebookApi.loadUser.mockResolvedValue({
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id'
  })
  accountRepository.load.mockResolvedValue(undefined)
  accountRepository.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })

  return {
    sut,
    facebookApi,
    accountRepository,
    crypto
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

  it('Should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({
      any: 'any'
    }))

    mocked(FacebookAccount).mockImplementation(FacebookAccountStub)

    const { sut, accountRepository } = makeSut()

    await sut.perform({ token: 'any_token' })

    expect(accountRepository.saveWithFacebook).toHaveBeenCalledWith({
      any: 'any'
    })

    expect(accountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('Should call TokenGenerator with correct params', async () => {
    const { sut, crypto } = makeSut()

    await sut.perform({ token: 'any_token' })

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })

    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })
})
