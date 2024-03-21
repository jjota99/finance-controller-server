import {
   HttpException,
   HttpStatus,
   Injectable,
   UnauthorizedException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import { LoginDto } from './dto/login.dto'
import { User } from '../users/entities/user.entity'
import { JwtService } from '@nestjs/jwt'
import * as dotenv from 'dotenv'
import * as process from 'process'

dotenv.config()

@Injectable()
export class AuthService {
   constructor(
      private readonly usersService: UsersService,
      private jwtService: JwtService,
   ) {}
   async sigIn(request: Request, loginDto: LoginDto): Promise<{ access_token: string }> {
      const user: User = await this.usersService.findOneByCpf(loginDto.login)
      const passwordIsValid: boolean = await this.validatePasswordEncrypted(
         loginDto.password,
         user?.password,
      )
      const token = request.headers['authorization']?.split(':')[1]

      if (!passwordIsValid) {
         throw new UnauthorizedException({
            status: HttpStatus.UNAUTHORIZED,
            message: 'Senha inválida!',
         })
      }

      if (token) {
         const decode = this.validateAcessToken(loginDto.token)

         if (decode !== null) {
            throw new HttpException(
               { status: HttpStatus.OK, message: 'Autenticado com sucesso!' },
               HttpStatus.OK,
            )
         }
      }

      return await this.generateAccessToken(user)
   }

   private async validateAcessToken(
      token: string,
   ): Promise<{ id: number; name: string; cpf: string }> {
      try {
         return await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_KEY,
         })
      } catch {
         return null
      }
   }

   private async generateAccessToken(user: User): Promise<{ access_token: string }> {
      const payload = {
         id: user.id,
         name: user.name,
         cpf: user.cpf,
      }

      return {
         access_token: await this.jwtService.signAsync(payload),
      }
   }

   private async validatePasswordEncrypted(
      reqPassword: string,
      userPassword: string,
   ): Promise<boolean> {
      return await bcrypt.compare(reqPassword, userPassword)
   }
}
