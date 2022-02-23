import { UnathorizedException } from '@/application/exceptions'
import { PostgresUserAccount } from '@/infrastructure/postgres/entities'
import { app } from '@/main/config/app'
import { makeFakeDb } from '@/tests/infrastructure/postgres/mocks'
import { IBackup } from 'pg-mem'
import request from 'supertest'

describe('Login Routes', () => {
  describe('POST /login/facebook', () => {
    let cleanBackup: IBackup
    const loadUserSpy = jest.fn()

    jest.mock('@/infrastructure/apis/facebook', () => ({
      FacebookApi: jest.fn().mockReturnValue({
        loadUser: loadUserSpy
      })
    }))

    beforeAll(async () => {
      const db = await makeFakeDb([PostgresUserAccount])
      cleanBackup = db.backup()
    })

    beforeEach(() => {
      cleanBackup.restore()
    })

    it('Should return 200 with AccessToken', async () => {
      loadUserSpy.mockResolvedValueOnce({
        facebookId: 'any_fb_id',
        name: 'any_name',
        email: 'any_email'
      })

      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({
          token: 'valid_token'
        })

      expect(status).toBe(200)
      expect(body.accessToken).toBeDefined()
    })

    it('Should return 401 with UnathorizedException', async () => {
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({
          token: 'invalid_token'
        })

      expect(status).toBe(401)
      expect(body).toEqual({ error: new UnathorizedException().message })
    })
  })
})
