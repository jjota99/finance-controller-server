import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { Transaction } from './entities/transaction.entity'

@Injectable()
export class TransactionsService {
   constructor(
      @InjectDataSource()
      private connection: DataSource,
      @InjectRepository(Transaction)
      private transactionsRepository: Repository<Transaction>,
   ) {}

   async findAll(userId: number) {
      const queryRunner = this.connection.createQueryRunner()

      try {
         await queryRunner.connect()
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
            .where('user_id = :userId', { userId })
            .orderBy('transaction.transaction_date', 'ASC')
            .getRawMany()

         if ((await transactions).length === 0) {
            throw new HttpException(
               { status: HttpStatus.NO_CONTENT, warn: 'Não há transações!' },
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

   async findOne(id: number, userId: number): Promise<Transaction> {
      const transaction = await this.transactionsRepository.findOne({
         where: { id: id, userId: userId },
      })

      if (transaction === null) {
         throw new HttpException(
            { status: HttpStatus.NOT_FOUND, warn: 'Transação inexistente!' },
            HttpStatus.NOT_FOUND,
         )
      }

      return transaction
   }

   create(createTransactionDto: CreateTransactionDto) {
      const { transactionValue, transactionType } = createTransactionDto
      const formatedTransaction = {
         ...createTransactionDto,
         transactionValue:
            transactionType === 'Saída' ? transactionValue * -1 : transactionValue,
      }
      const createTransaction = this.transactionsRepository.create(formatedTransaction)

      return this.transactionsRepository.save(createTransaction)
   }

   async update(
      id: number,
      updateTransactionDto: UpdateTransactionDto,
   ): Promise<UpdateResult> {
      const transaction = await this.transactionsRepository.findOne({ where: { id: id } })

      if (transaction === null) {
         throw new HttpException(
            { status: HttpStatus.NOT_FOUND, error: 'Transação inexistente!' },
            HttpStatus.NOT_FOUND,
         )
      }

      return this.transactionsRepository.update(id, updateTransactionDto)
   }

   async remove(id: number): Promise<DeleteResult> {
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
