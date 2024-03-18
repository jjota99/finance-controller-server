import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
   constructor(private readonly usersService: UsersService) {}
   async login(loginDto: LoginDto): Promise<boolean> {
      const user = await this.usersService.findOneByCpf(loginDto.login)

      return await this.validatePasswordEncrypted(loginDto.password, user?.password)
   }

   private async validatePasswordEncrypted(
      reqPassword: string,
      userPassword: string,
   ): Promise<boolean> {
      const isValid = await bcrypt.compare(reqPassword, userPassword)

      if (!isValid) {
         throw new HttpException(
            {
               status: HttpStatus.BAD_REQUEST,
               message: 'Senha inválida!',
            },
            HttpStatus.BAD_REQUEST,
         )
      }

      return isValid
   }
}
