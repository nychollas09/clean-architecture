import {
  PostgresUserAccount,
  PostgresUserAccountRepository
} from '@/infrastructure/postgres/repositories'
import { newDb, IBackup } from 'pg-mem'
import { getRepository, Repository, getConnection } from 'typeorm'

describe('PostgresUserAccountRepository', () => {
  describe('load', () => {
    let sut: PostgresUserAccountRepository
    let pgUserAccountRepository: Repository<PostgresUserAccount>
    let cleanBackup: IBackup

    beforeAll(async () => {
      const db = newDb()
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PostgresUserAccount]
      })
      await connection.synchronize()
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

  describe('save', () => {})
})
