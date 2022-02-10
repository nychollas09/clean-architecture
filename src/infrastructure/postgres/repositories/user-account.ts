import { LoadUserAccountRepository } from '@/data/contracts/repositories'
import { getRepository } from 'typeorm'
import { PostgresUserAccount } from '@/infrastructure/postgres/entities'

export class PostgresUserAccountRepository
  implements LoadUserAccountRepository
{
  async load(
    params: LoadUserAccountRepository.Params
  ): Promise<LoadUserAccountRepository.Result> {
    const pgUserAccountRepository = getRepository(PostgresUserAccount)

    const pgUserAccount = await pgUserAccountRepository.findOne({
      email: params.email
    })

    return pgUserAccount != null
      ? {
          id: pgUserAccount.id.toString(),
          name: pgUserAccount.name ?? undefined
        }
      : undefined
  }
}
