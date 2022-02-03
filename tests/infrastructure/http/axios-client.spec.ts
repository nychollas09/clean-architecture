import { AxiosHttpClient } from '@/infrastructure/http'
import axios from 'axios'

jest.mock('axios')

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient

  beforeEach(() => {
    sut = new AxiosHttpClient()
  })

  describe('get', () => {
    it('should call get with correct params', async () => {
      const fakeAxios = axios as jest.Mocked<typeof axios>
      await sut.get({ url: 'any_url', queryParams: { any: 'any' } })

      expect(fakeAxios.get).toHaveBeenCalledWith('any_url', {
        params: { any: 'any' }
      })

      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })
  })
})
