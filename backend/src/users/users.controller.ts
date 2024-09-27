import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/auth/decorators/getCuttentUser.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateUserDto } from 'src/users/dto/updateUser.dto';
import { UsersService } from 'src/users/users.service';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile')
  @Roles(Role.User, Role.Admin)
  async getUser(@User() user: { email: string }) {
    return this.usersService.getUser(user.email);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('profile')
  @Roles(Role.User, Role.Admin)
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/jpg',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException('File ảnh không hợp lệ!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async updateUser(
    @User() user: { email: string },
    @Body() updateUser: UpdateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    // console.log(updateUser); // Các trường như fullName, currentPassword
    // console.log(avatar); // Tệp avatar nếu có

    return this.usersService.updateUser(user, updateUser, avatar);
  }
}
