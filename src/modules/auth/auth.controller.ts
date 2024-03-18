import { Body, Controller, Get } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @Get('login')
   async login(@Body() loginDto: LoginDto): Promise<boolean> {
      return await this.authService.login(loginDto)
   }
}
