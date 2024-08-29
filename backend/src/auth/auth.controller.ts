import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { RegisterDto } from 'src/auth/dto/registerDto.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServer: AuthService) {}
  @Post('register')
  async register(@Body() registerData: RegisterDto) {
    return await this.authServer.register(registerData);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }
}
