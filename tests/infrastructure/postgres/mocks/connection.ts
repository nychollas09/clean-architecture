import { IMemoryDb, newDb } from 'pg-mem'
import { resolve } from 'path'

export const makeFakeDb = async (entities?: any[]): Promise<IMemoryDb> => {
  const db = newDb()
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: [
      ...(entities ?? [resolve(__dirname, '..', 'entities', 'index.ts')])
    ]
  })
  await connection.synchronize()

  return db
}
