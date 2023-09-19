import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tb_fat_transacoes')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transactionName: string;

  @Column()
  transactionDate: string;

  @Column()
  transactionType: string;

  @Column()
  transactionValue: number;
}
