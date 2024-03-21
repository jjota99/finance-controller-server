import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @HttpCode(HttpStatus.OK)
   @Post('sign-in')
   async login(
      @Req() request: Request,
      @Body() loginDto: LoginDto,
   ): Promise<{ access_token: string }> {
      return await this.authService.sigIn(request, loginDto)
   }
}
