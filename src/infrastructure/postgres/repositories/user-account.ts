import { LoadUserAccountRepository } from '@/data/contracts/repositories'
import { Entity, PrimaryGeneratedColumn, Column, getRepository } from 'typeorm'

@Entity({ name: 'usuarios' })
export class PostgresUserAccount {
  @PrimaryGeneratedColumn()
  public id!: number

  @Column({ name: 'nome', nullable: true })
  public name?: string

  @Column()
  public email!: string

  @Column({ name: 'id_facebook', nullable: true })
  public facebookId?: string
}

export class PostgresUserAccountRepository
  implements LoadUserAccountRepository {
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
