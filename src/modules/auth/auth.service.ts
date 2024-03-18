import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import { LoginDto } from './dto/login.dto'
import { User } from '../users/entities/user.entity'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
   constructor(
      private readonly usersService: UsersService,
      private jwtService: JwtService,
   ) {}
   async sigIn(loginDto: LoginDto): Promise<{ acess_token: string }> {
      const user: User = await this.usersService.findOneByCpf(loginDto.login)
      const passwordIsValid: boolean = await this.validatePasswordEncrypted(
         loginDto.password,
         user?.password,
      )

      if (!passwordIsValid) {
         throw new HttpException(
            {
               status: HttpStatus.BAD_REQUEST,
               message: 'Senha inválida!',
            },
            HttpStatus.BAD_REQUEST,
         )
      }

      const payload = {
         id: user.id,
         name: user.name,
         cpf: user.cpf,
      }

      return {
         acess_token: await this.jwtService.signAsync(payload),
      }
   }

   private async validatePasswordEncrypted(
      reqPassword: string,
      userPassword: string,
   ): Promise<boolean> {
      return await bcrypt.compare(reqPassword, userPassword)
   }
}
