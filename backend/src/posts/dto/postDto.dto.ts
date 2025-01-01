import { IsArray, IsNotEmpty, IsString, ArrayNotEmpty } from 'class-validator';

export class CreatePostDto {
  images: Array<Express.Multer.File>;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  tag: string;
}
