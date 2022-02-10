import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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
