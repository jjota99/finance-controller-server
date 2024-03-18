import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { User } from './entities/user.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
   constructor(
      @InjectDataSource()
      private connection: DataSource,
      @InjectRepository(User)
      private repository: Repository<User>,
   ) {}

   async findAll(): Promise<User[]> {
      const users = await this.repository.find({})

      if (users.length === 0) {
         throw new HttpException(
            { status: HttpStatus.NO_CONTENT, warn: 'Não há usuários!' },
            HttpStatus.NO_CONTENT,
         )
      }

      return users
   }

   async findOne(id: number): Promise<User> {
      const user = await this.repository.findOne({ where: { id } })

      if (user === null) {
         new HttpException(
            { status: HttpStatus.NO_CONTENT, warn: 'Usuário não encontrado!' },
            HttpStatus.NO_CONTENT,
         )
      }

      return user
   }

   async findOneByCpf(cpf: string): Promise<User> {
      const user = await this.repository.findOne({ where: { cpf: cpf } })

      if (user === null) {
         throw new HttpException(
            { status: HttpStatus.NO_CONTENT, warn: 'CPF inválido!' },
            HttpStatus.NO_CONTENT,
         )
      }

      return user
   }

   async create(createUserDto: CreateUserDto): Promise<void> {
      const userWithEncryptedPassword: CreateUserDto = {
         ...createUserDto,
         password: await bcrypt.hash(createUserDto.password, 10),
      }

      await this.validateExistentUniqueFields(createUserDto)
      await this.validatePasswordEquality(createUserDto)

      await this.repository.save(userWithEncryptedPassword)
   }

   private async validateExistentUniqueFields(user: CreateUserDto): Promise<void> {
      const findUserByUniqueFields = await this.repository.findOne({
         where: { cpf: user.cpf },
      })

      if (findUserByUniqueFields !== null) {
         throw new HttpException(
            {
               status: HttpStatus.BAD_REQUEST,
               error: 'CPF já está em uso!',
            },
            HttpStatus.BAD_REQUEST,
         )
      }
   }

   private async validatePasswordEquality(user: CreateUserDto): Promise<void> {
      if (user.password !== user.passwordConfirm) {
         throw new HttpException(
            {
               status: HttpStatus.BAD_REQUEST,
               error: 'Os campos de senha estão diferentes!',
            },
            HttpStatus.BAD_REQUEST,
         )
      }
   }
}
