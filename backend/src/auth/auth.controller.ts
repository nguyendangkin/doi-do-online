import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { RegisterDto } from 'src/auth/dto/registerDto.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() registerData: RegisterDto) {
    return await this.authService.register(registerData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req.user, res);
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token');
    return { message: 'Đăng xuất thành công' };
  }

  @Post('refresh-token')
  async refreshNewToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      res.status(401).json({ message: 'Không tìm thấy Refresh Token' });
      return;
    }
    return this.authService.refreshNewToken(refreshToken);
  }
}
