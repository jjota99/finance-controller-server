import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @HttpCode(HttpStatus.OK)
   @Post('sign-in')
   async login(@Body() loginDto: LoginDto): Promise<{ acess_token: string }> {
      return await this.authService.sigIn(loginDto)
   }
}
