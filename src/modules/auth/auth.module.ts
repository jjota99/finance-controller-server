import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from '../users/users.module'
import { JwtModule } from '@nestjs/jwt'
import * as dotenv from 'dotenv'

dotenv.config()

@Module({
   imports: [
      UsersModule,
      JwtModule.register({
         secret: process.env.JWT_KEY,
         global: true,
         signOptions: { expiresIn: '12h' },
      }),
   ],
   controllers: [AuthController],
   providers: [AuthService],
   exports: [AuthService],
})
export class AuthModule {}
