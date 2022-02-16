import { PostgresUserAccountRepository } from '@/infrastructure/postgres/repositories'

export const makePostgresUserAccountRepository =
  (): PostgresUserAccountRepository => new PostgresUserAccountRepository()
