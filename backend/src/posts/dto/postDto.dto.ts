import { IsArray, IsNotEmpty, IsString, ArrayNotEmpty } from 'class-validator';

export class CreatePostDto {
  images: Array<Express.Multer.File>; // Sử dụng kiểu dữ liệu chính xác cho file

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  tag: string;
}
