import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/registerDto.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

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

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneUserByEmail(email);
    if (user && (await this.handleComparePassword(pass, user.password))) {
      const { password, ...result } = user;
      return {
        statusCode: HttpStatus.OK,
        message: 'Đăng nhập thành công.',
        result,
      };
    }
    return null;
  }
}
