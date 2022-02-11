import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository
} from '@/data/contracts/repositories'
import { getRepository, Repository } from 'typeorm'
import { PostgresUserAccount } from '@/infrastructure/postgres/entities'

export class PostgresUserAccountRepository
  implements LoadUserAccountRepository
{
  private readonly pgUserAccountRepository: Repository<PostgresUserAccount>

  constructor() {
    this.pgUserAccountRepository = getRepository(PostgresUserAccount)
  }

  async load(
    params: LoadUserAccountRepository.Params
  ): Promise<LoadUserAccountRepository.Result> {
    const pgUserAccount = await this.pgUserAccountRepository.findOne({
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
    const { id } = await this.pgUserAccountRepository.save({
      email: params.email,
      name: params.name,
      facebookId: params.facebookId
    })

    return { id: String(id) }
  }
}
