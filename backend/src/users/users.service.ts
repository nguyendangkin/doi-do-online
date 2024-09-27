import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { error } from 'console';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { UpdateUserDto } from 'src/users/dto/updateUser.dto';
import { Users } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

  async updateUser(
    user: any,
    updateUserDto: UpdateUserDto,
    avatar: Express.Multer.File,
  ) {
    const { currentPassword, newPassword, fullName } = updateUserDto;

    // Tìm người dùng hiện tại từ email
    const userEntity = await this.findOneUserByEmail(user.email);
    if (!userEntity) {
      throw new BadRequestException('User not found');
    }

    // Xác thực mật khẩu hiện tại
    if (
      currentPassword &&
      !(await bcrypt.compare(currentPassword, userEntity.password))
    ) {
      throw new BadRequestException('Mật khẩu hiện tại không khớp');
    }

    // Nếu có mật khẩu mới thì mã hóa và lưu
    if (newPassword) {
      userEntity.password = await bcrypt.hash(newPassword, 10);
    }

    // Cập nhật tên đầy đủ nếu có
    if (fullName) {
      userEntity.fullName = fullName;
    }

    // Xử lý avatar
    if (avatar) {
      const avatarUrl = await this.uploadAvatar(avatar);
      userEntity.avatarUrl = avatarUrl;
    }

    // Lưu lại thông tin người dùng
    await this.usersRepository.save(userEntity);

    return {
      fullName: userEntity.fullName,
      email: userEntity.email,
      avatarUrl: userEntity.avatarUrl,
      role: userEntity.role,
    };
  }
  async uploadAvatar(avatar: Express.Multer.File): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'uploads');

    // Tạo thư mục uploads nếu chưa tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileExtension = path.extname(avatar.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Ghi file vào hệ thống file
    fs.writeFileSync(filePath, avatar.buffer);

    // Trả về đường dẫn tương đối của file
    return `/uploads/${fileName}`;
  }
}
