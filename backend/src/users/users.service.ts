import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { error } from 'console';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { Users } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}
  async findOneUserByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      if (user) {
        return user;
      }
      return false;
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

  async createUser(createUserData: CreateUserDto) {
    try {
      const user = await this.usersRepository.create(createUserData);
      await this.usersRepository.save(user);

      return {
        message: 'Tạo tài khoản thành công',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error('Lỗi không xác định', error);
        throw new HttpException(
          'Đã xảy ra lỗi',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getUser(email: string) {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      const { password, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error('Lỗi không xác định', error);
        throw new HttpException(
          'Đã xãy ra lỗi',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
