import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'

@Controller('transactions')
export class TransactionsController {
   constructor(private readonly transactionsService: TransactionsService) {}

   @Get('/detail/month-amount')
   findDetail() {
      return this.transactionsService.findMonthAmountDetail()
   }

   @Get()
   findAll() {
      return this.transactionsService.findAll()
   }

   @Get('/find-one/:id')
   findOne(@Param('id') id: string) {
      return this.transactionsService.findOne(+id)
   }

   @Post('/create')
   create(@Body() createTransactionDto: CreateTransactionDto) {
      return this.transactionsService.create(createTransactionDto)
   }

   @Put('/update/:id')
   update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
      return this.transactionsService.update(+id, updateTransactionDto)
   }

   @Delete('/delete/:id')
   remove(@Param('id') id: string) {
      return this.transactionsService.remove(+id)
   }
}
