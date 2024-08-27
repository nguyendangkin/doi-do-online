import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'Họ và tên phải là chuỗi ký tự.' })
  fullName: string;

  @IsEmail({}, { message: 'Email không hợp lệ.' })
  email: string;

  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự.' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
  password: string;
}
