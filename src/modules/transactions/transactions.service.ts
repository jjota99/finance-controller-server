import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectConnection, InjectRepository } from '@nestjs/typeorm'
import { Repository, Connection } from 'typeorm'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { Transaction } from './entities/transaction.entity'

@Injectable()
export class TransactionsService {
   constructor(
      @InjectConnection()
      private connection: Connection,
      @InjectRepository(Transaction)
      private transactionsRepository: Repository<Transaction>,
   ) {}

   create(createTransactionDto: CreateTransactionDto) {
      const createTransaction = this.transactionsRepository.create(createTransactionDto)
      return this.transactionsRepository.save(createTransaction)
   }

   async findAll() {
      const queryRunner = this.connection.createQueryRunner()
      await queryRunner.connect()

      try {
         const transactions: Promise<Transaction[]> = queryRunner.manager
            .createQueryBuilder()
            .select('transaction.id', 'id')
            .addSelect('transaction.transaction_name', 'transactionName')
            .addSelect(
               "to_char(transaction.transaction_date, 'YYYY-MM-DD')",
               'transactionDate',
            )
            .addSelect('transaction.transaction_type', 'transactionType')
            .addSelect('transaction.transaction_value', 'transactionValue')
            .from(Transaction, 'transaction')
            .orderBy('transaction.transaction_date', 'ASC')
            .getRawMany()

         if ((await transactions).length === 0) {
            throw new HttpException(
               { status: HttpStatus.NO_CONTENT, error: 'Não há transações!' },
               HttpStatus.NO_CONTENT,
            )
         }

         return transactions
      } catch (error) {
         throw error
      } finally {
         await queryRunner.release()
      }
   }

   async findOne(id: number) {
      const transaction = await this.transactionsRepository.findOne({ where: { id: id } })
      if (transaction === null) {
         throw new HttpException(
            { status: HttpStatus.NOT_FOUND, error: 'Transação inexistente!' },
            HttpStatus.NOT_FOUND,
         )
      }
      return transaction
   }

   async update(id: number, updateTransactionDto: UpdateTransactionDto) {
      const transaction = await this.transactionsRepository.findOne({ where: { id: id } })
      if (transaction === null) {
         throw new HttpException(
            { status: HttpStatus.NOT_FOUND, error: 'Transação inexistente!' },
            HttpStatus.NOT_FOUND,
         )
      }
      return this.transactionsRepository.update(id, updateTransactionDto)
   }

   async remove(id: number) {
      const transaction = await this.transactionsRepository.findOne({ where: { id: id } })
      if (transaction === null) {
         throw new HttpException(
            { status: HttpStatus.NOT_FOUND, error: 'Transação inexistente!' },
            HttpStatus.NOT_FOUND,
         )
      }

      return this.transactionsRepository.delete(id)
   }
}
