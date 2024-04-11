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

         const transactions: Transaction[] = await queryRunner.manager.query(
            `SELECT transaction.id                                      AS id,
                          transaction.user_id                                 AS "userId",
                          transaction.transaction_name                        AS "transactionName",
                          TO_CHAR(transaction.transaction_date, 'DD/MM/YYYY') AS "transactionDate",
                          transaction.transaction_type                        AS "transactionType",
                          transaction.transaction_value                       AS "transactionValue"
                        FROM tb_fat_transacoes transaction
                        WHERE user_id = ${userId}
                        ORDER BY transaction.transaction_date ASC;`,
         )

         if (transactions.length === 0) {
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

   async findAmountDetail(userId: number) {
      const income = await this.getAmountForType('Entrada', userId)
      const outcome = await this.getAmountForType('Saida', userId)
      const total = await this.getAmountForType('Total', userId)

      return { income: income[0], outcome: outcome[0], total: total[0] }
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
      const transaction = await this.transactionsRepository.findOne({
         where: { id: id, userId: updateTransactionDto.userId },
      })

      if (transaction === null) {
         throw new HttpException(
            { status: HttpStatus.NOT_FOUND, error: 'Transação inexistente!' },
            HttpStatus.NOT_FOUND,
         )
      }

      return this.transactionsRepository.update(
         { id: id, userId: updateTransactionDto.userId },
         updateTransactionDto,
      )
   }

   async remove(id: number, userId: number): Promise<DeleteResult> {
      const transaction = await this.transactionsRepository.findOne({
         where: { id: id, userId: userId },
      })

      if (transaction === null) {
         throw new HttpException(
            { status: HttpStatus.NOT_FOUND, error: 'Transação inexistente!' },
            HttpStatus.NOT_FOUND,
         )
      }

      return this.transactionsRepository.delete({ id: id, userId: userId })
   }

   private async getAmountForType(
      type: string,
      userId: number,
   ): Promise<{ value: string; status: string }[]> {
      const queryRunner = this.connection.createQueryRunner()

      try {
         await queryRunner.connect()

         if (type !== 'Total') {
            return await queryRunner.manager.query(
               `SELECT *,
                             CASE 
                             WHEN value::NUMERIC >= 0 THEN 'positive' 
                             ELSE 'negative' 
                             END status 
                      FROM (
                          SELECT SUM(transaction_value) AS value 
                          FROM tb_fat_transacoes 
                          WHERE transaction_type = '${type}' 
                            AND user_id = '${userId}') AS t;`,
            )
         }

         return await queryRunner.query(
            `SELECT *, 
                          CASE 
                          WHEN value::NUMERIC >= 0 THEN 'positive' 
                          ELSE 'negative' 
                          END status 
                   FROM (
                       SELECT SUM(transaction_value) AS value 
                       FROM tb_fat_transacoes 
                       WHERE user_id = '${userId}') AS t;`,
         )
      } catch (error) {
         console.log(error)
      } finally {
         await queryRunner.release()
      }
   }
}
