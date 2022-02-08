import { AxiosHttpClient } from '@/infrastructure/http'
import axios from 'axios'

jest.mock('axios')

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient
  let fakeAxios: jest.Mocked<typeof axios>
  let url: string
  let queryParams: { [key: string]: string }

  beforeAll(() => {
    fakeAxios = axios as jest.Mocked<typeof axios>
    url = 'any_url'
    queryParams = { any: 'any' }
    fakeAxios.get.mockResolvedValue({
      status: 200,
      data: 'any_data'
    })
  })

  beforeEach(() => {
    jest.clearAllMocks()
    sut = new AxiosHttpClient()
  })

  describe('get', () => {
    it('should call get with correct params', async () => {
      await sut.get({ url, queryParams })

      expect(fakeAxios.get).toHaveBeenCalledWith(url, {
        params: queryParams
      })

      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })

    it('should return data on success', async () => {
      const result = await sut.get({ url, queryParams })

      expect(result).toEqual('any_data')

      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })

    it('should rethrow if get throws', async () => {
      fakeAxios.get.mockRejectedValueOnce(new Error('http_error'))

      const promise = sut.get({ url, queryParams })

      await expect(promise).rejects.toThrow(new Error('http_error'))
    })
  })
})
