import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { UserInfosDto } from './dto/user-infos.dto'

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @HttpCode(HttpStatus.OK)
   @Post('sign-in')
   async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
      return await this.authService.sigIn(loginDto)
   }

   @Get('/me')
   async me(@Query('token') token: string): Promise<UserInfosDto> {
      return await this.authService.verifyAcessToken(token)
   }
}
