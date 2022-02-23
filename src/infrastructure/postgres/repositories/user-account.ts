import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository
} from '@/data/contracts/repositories'
import { PostgresUserAccount } from '@/infrastructure/postgres/entities'
import { getRepository } from 'typeorm'

export class PostgresUserAccountRepository
  implements LoadUserAccountRepository, SaveFacebookAccountRepository
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

  async saveWithFacebook(
    params: SaveFacebookAccountRepository.Params
  ): Promise<SaveFacebookAccountRepository.Result> {
    const pgUserAccountRepository = getRepository(PostgresUserAccount)

    if (params.id !== undefined) {
      await pgUserAccountRepository.update(
        { id: Number(params.id) },
        { name: params.name, facebookId: params.facebookId }
      )

      return { id: String(params.id) }
    }

    const { id } = await pgUserAccountRepository.save({
      email: params.email,
      name: params.name,
      facebookId: params.facebookId
    })

    return { id: String(id) }
  }
}
