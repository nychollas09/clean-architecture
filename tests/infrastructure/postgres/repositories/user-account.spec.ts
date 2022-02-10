import {
  PostgresUserAccount,
  PostgresUserAccountRepository
} from '@/infrastructure/postgres/repositories'
import { newDb } from 'pg-mem'
import { getRepository } from 'typeorm'

describe('PostgresUserAccountRepository', () => {
  let sut: PostgresUserAccountRepository

  beforeEach(() => {
    sut = new PostgresUserAccountRepository()
  })

  describe('load', () => {
    it('Should return an account if email exists', async () => {
      const db = newDb()

      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PostgresUserAccount]
      })

      await connection.synchronize()

      const pgUserAccountRepository = getRepository(PostgresUserAccount)

      await pgUserAccountRepository.save({ email: 'existing_email' })

      const account = await sut.load({ email: 'existing_email' })

      expect(account).toEqual({ id: '1' })

      await connection.close()
    })

    it('Should return undefined if email does not exists', async () => {
      const db = newDb()

      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PostgresUserAccount]
      })

      await connection.synchronize()

      const account = await sut.load({ email: 'new_email' })

      expect(account).toBeUndefined()

      await connection.close()
    })
  })

  describe('save', () => {})
})
