import {
  IsArray,
  IsNotEmpty,
  IsString,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';

export class UpdatePostDto {
  images: Array<Express.Multer.File>;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  tag: string;

  @IsOptional()
  @IsString()
  existingImages?: string;
}
