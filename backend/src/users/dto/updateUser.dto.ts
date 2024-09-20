import { IsEmail, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'Họ và tên phải là chuỗi ký tự.' })
  @MinLength(1, { message: 'Họ và tên phải có ít nhất 1 ký tự.' })
  fullName?: string;

  @IsEmail({}, { message: 'Email không hợp lệ.' })
  email: string;

  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự.' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
  currentPassword?: string;

  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự.' })
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' })
  newPassword?: string;
}
