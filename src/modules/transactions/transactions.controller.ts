import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Post,
   Put,
   UseGuards,
} from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { AuthGuard } from '../../guard/auth.guard'

// @UseGuards(AuthGuard)
@Controller('transactions')
export class TransactionsController {
   constructor(private readonly transactionsService: TransactionsService) {}

   @Get('/:userId')
   findAll(@Param('userId') userId: string) {
      return this.transactionsService.findAll(+userId)
   }

   @Get('/find-one/id/:id/user/:userId')
   findOne(@Param('id') id: string, @Param('userId') userId: string) {
      return this.transactionsService.findOne(+id, +userId)
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
