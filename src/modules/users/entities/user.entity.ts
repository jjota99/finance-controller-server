import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('tb_user')
export class User {
   @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
   id: number

   @Column({ name: 'name' })
   name: string

   @Column({ name: 'cpf', length: 11 })
   cpf: string

   @Column({ name: 'password' })
   password: string
}
