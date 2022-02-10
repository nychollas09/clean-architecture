import { makeFakeDb } from '@/infrastructure/postgres/utils'
import { Column, Entity, getConnection, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
class FakeEntity {
  @PrimaryGeneratedColumn()
  public id!: number

  @Column()
  public name?: string
}

describe('Db', () => {
  describe('FakeDb', () => {
    afterEach(async () => {
      await getConnection().close()
    })

    it('Should return IMemoryDb when create with entities params', async () => {
      const db = await makeFakeDb([FakeEntity])

      expect(db).toBeDefined()
    })

    it('Should return IMemoryDb when create without entities params', async () => {
      const db = await makeFakeDb()

      expect(db).toBeDefined()
    })
  })
})
