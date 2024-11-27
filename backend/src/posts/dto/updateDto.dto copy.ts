import {
  IsArray,
  IsNotEmpty,
  IsString,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';

export class UpdatePostDto {
  images: Array<Express.Multer.File>; // Sử dụng kiểu dữ liệu chính xác cho file

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  tag: string;

  @IsOptional()
  @IsString()
  existingImages?: string; // JSON string of existing image URLs
}
