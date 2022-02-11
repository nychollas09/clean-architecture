import { PostgresUserAccount } from '@/infrastructure/postgres/entities'
import { PostgresUserAccountRepository } from '@/infrastructure/postgres/repositories'

import { IBackup } from 'pg-mem'
import { getConnection, getRepository, Repository } from 'typeorm'
import { makeFakeDb } from '@/tests/infrastructure/postgres/mocks'

describe('PostgresUserAccountRepository', () => {
  let sut: PostgresUserAccountRepository
  let pgUserAccountRepository: Repository<PostgresUserAccount>
  let cleanBackup: IBackup

  beforeAll(async () => {
    const db = await makeFakeDb([PostgresUserAccount])
    cleanBackup = db.backup()
    pgUserAccountRepository = getRepository(PostgresUserAccount)
  })

  beforeEach(() => {
    cleanBackup.restore()
    sut = new PostgresUserAccountRepository()
  })

  afterAll(async () => {
    await getConnection().close()
  })

  describe('load', () => {
    it('Should return an account if email exists', async () => {
      await pgUserAccountRepository.save({ email: 'any_email' })

      const account = await sut.load({ email: 'any_email' })

      expect(account).toEqual({ id: '1' })
    })

    it('Should return undefined if email does not exists', async () => {
      const account = await sut.load({ email: 'any_email' })

      expect(account).toBeUndefined()
    })
  })

  describe('save', () => {
    it('Should create an account if id is undefined', async () => {
      await sut.saveWithFacebook({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })

      const pgUserAccount = await pgUserAccountRepository.findOne({
        email: 'any_email'
      })

      expect(pgUserAccount?.id).toBe(1)
    })

    it('Should update account if id is defined', async () => {
      await pgUserAccountRepository.save({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })

      await sut.saveWithFacebook({
        id: '1',
        email: 'new_email',
        name: 'new_name',
        facebookId: 'new_fb_id'
      })

      const pgUserAccount = await pgUserAccountRepository.findOne({ id: 1 })

      expect(pgUserAccount).toEqual({
        id: 1,
        email: 'any_email',
        name: 'new_name',
        facebookId: 'new_fb_id'
      })
    })
  })
})
