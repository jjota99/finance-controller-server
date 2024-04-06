import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('tb_fat_transacoes')
export class Transaction {
   @PrimaryGeneratedColumn()
   id: number

   @Column({ name: 'transaction_name' })
   transactionName: string

   @Column({ name: 'transaction_date' })
   transactionDate: Date

   @Column({ name: 'transaction_type' })
   transactionType: string

   @Column({ name: 'transaction_value' })
   transactionValue: number

   @Column({ name: 'user_id' })
   userId: number
}
