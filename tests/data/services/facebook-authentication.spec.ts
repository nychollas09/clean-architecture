import { LoadFacebookUserApi } from '@/data/contracts/apis'
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository
} from '@/data/contracts/repositories'
import { FacebookAuthenticationService } from '@/data/services/facebook-authentication'
import { AuthenticationException } from '@/domain/exceptions'
import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: FacebookAuthenticationService
  loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  loadUserAccountRepository: MockProxy<LoadUserAccountRepository>
  createFacebookAccountRepository: MockProxy<CreateFacebookAccountRepository>
}

const makeSut = (): SutTypes => {
  const loadFacebookUserApi = mock<LoadFacebookUserApi>()
  const loadUserAccountRepository = mock<LoadUserAccountRepository>()
  const createFacebookAccountRepository =
    mock<CreateFacebookAccountRepository>()

  const sut = new FacebookAuthenticationService(
    loadFacebookUserApi,
    loadUserAccountRepository,
    createFacebookAccountRepository
  )

  loadFacebookUserApi.loadUser.mockResolvedValue({
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id'
  })

  return {
    sut,
    loadFacebookUserApi,
    loadUserAccountRepository,
    createFacebookAccountRepository
  }
}

describe('FacebookAuthenticationService', () => {
  it('Should call LoadFacebookUserApi with correct params', async () => {
    const { sut, loadFacebookUserApi } = makeSut()
    await sut.perform({ token: 'any_token' })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({
      token: 'any_token'
    })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationException when LoadFacebookUserApi returns undefined', async () => {
    const { sut, loadFacebookUserApi } = makeSut()

    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationException())
  })

  it('Should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    const { sut, loadUserAccountRepository } = makeSut()

    await sut.perform({ token: 'any_token' })

    expect(loadUserAccountRepository.load).toHaveBeenCalledWith({
      email: 'any_fb_email'
    })
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('Should call CreateFacebookAccountRepository when LoadUserAccountRepository returns undefined', async () => {
    const { sut, loadUserAccountRepository, createFacebookAccountRepository } =
      makeSut()

    loadUserAccountRepository.load.mockResolvedValueOnce(undefined)

    await sut.perform({ token: 'any_token' })

    expect(
      createFacebookAccountRepository.createFromFacebook
    ).toHaveBeenCalledWith({
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id'
    })

    expect(
      createFacebookAccountRepository.createFromFacebook
    ).toHaveBeenCalledTimes(1)
  })
})
