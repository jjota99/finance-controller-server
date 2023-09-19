import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
constructor(
  @InjectRepository(Transaction)
  private transactionsRepository: Repository<Transaction>
){}

  create(createTransactionDto: CreateTransactionDto) {
    const createTransaction =  this.transactionsRepository.create(createTransactionDto);
    return this.transactionsRepository.save(createTransaction);
  }

  async findAll() {
    const transactions = await this.transactionsRepository.find();
    if (transactions.length === 0) {
      throw new HttpException(
        { status: HttpStatus.NO_CONTENT, error: 'Não há transações!' }, 
        HttpStatus.NO_CONTENT
      );
    }
    return transactions;
  }

  async findOne(id: number) {
     const transaction = await this.transactionsRepository.findOne({ where: { id: id } });
     if (transaction === null) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Transação inexistente!' }, 
        HttpStatus.NOT_FOUND
      );
     }
     return transaction;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.transactionsRepository.findOne({ where: { id: id } });
    if (transaction === null) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Transação inexistente!' }, 
        HttpStatus.NOT_FOUND
        );
      }
    return this.transactionsRepository.update(id, updateTransactionDto);
  }

  async remove(id: number) {
    const transaction = await this.transactionsRepository.findOne({ where: { id: id } });
    if (transaction === null) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Transação inexistente!' }, 
        HttpStatus.NOT_FOUND
        );
      }

    return this.transactionsRepository.delete(id);
  }
}
