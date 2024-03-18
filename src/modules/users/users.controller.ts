import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './entities/user.entity'

@Controller('users')
export class UsersController {
   constructor(private readonly usersService: UsersService) {}

   @Get()
   findAll(): Promise<User[]> {
      return this.usersService.findAll()
   }

   @Get(':id')
   findOne(@Param('id') id: string): Promise<User> {
      return this.usersService.findOne(+id)
   }

   @Post()
   create(@Body() createUserDto: CreateUserDto): Promise<void> {
      return this.usersService.create(createUserDto)
   }
}
