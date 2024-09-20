import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/registerDto.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async handleHashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async handleComparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async register(registerData: RegisterDto) {
    try {
      const isExistUser = await this.usersService.findOneUserByEmail(
        registerData.email,
      );
      if (isExistUser) {
        throw new HttpException('Email đã tồn tại', HttpStatus.CONFLICT);
      }

      const hashPassword = await this.handleHashPassword(registerData.password);
      const result = this.usersService.createUser({
        ...registerData,
        password: hashPassword,
      });
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error('Lỗi không xác định:', error);
        throw new HttpException(
          'Đã xảy ra lỗi',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  handleGenerateAccessToken(user: any) {
    const payload = {
      email: user.email,
      id: user.id,
      role: user.role,
    };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION'),
    });
  }

  async setRefreshTokenCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: this.configService.get('JWT_SECRET'),
      sameSite: 'strict',
      maxAge: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
    });
  }

  handleGenerateRefreshToken(user: any) {
    const payload = {
      email: user.email,
      id: user.id,
      role: user.role,
    };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
    });
  }

  async refreshNewToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const accessToken = this.handleGenerateAccessToken(payload);
      return { access_token: accessToken };
    } catch (error) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneUserByEmail(email);
    if (user && (await this.handleComparePassword(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, res) {
    const accessToken = this.handleGenerateAccessToken(user);
    const refreshToken = this.handleGenerateRefreshToken(user);

    await this.setRefreshTokenCookie(res, refreshToken);

    return {
      message: 'Đăng nhập thành công',
      email: user.email,
      access_token: accessToken,
    };
  }
}
