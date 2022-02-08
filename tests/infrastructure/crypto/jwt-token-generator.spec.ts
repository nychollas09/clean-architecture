import { JwtTokenGenerator } from '@/infrastructure/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenGenerator', () => {
  let fakeJwt: jest.Mocked<typeof jwt>

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  it('should call sign with correct params', async () => {
    const sut = new JwtTokenGenerator('any_secret')

    await sut.generateToken({
      payload: {
        any: 'any'
      },
      expirationInMs: 1000
    })

    expect(fakeJwt.sign).toHaveBeenCalledWith(
      {
        any: 'any'
      },
      'any_secret',
      {
        expiresIn: '1000ms'
      }
    )
  })
})
