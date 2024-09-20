import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional() // Đánh dấu trường này là tùy chọn
  @IsString({ message: 'Họ và tên phải là chuỗi ký tự.' })
  @MinLength(1, { message: 'Họ và tên phải có ít nhất 1 ký tự.' })
  fullName?: string;

  @IsOptional() // Đánh dấu trường này là tùy chọn
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự.' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
  currentPassword?: string;

  @IsOptional() // Đánh dấu trường này là tùy chọn
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự.' })
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' })
  newPassword?: string;
}
