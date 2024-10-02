import { IsArray, IsNotEmpty, IsString, ArrayNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsArray() // Kiểm tra xem images có phải là một mảng hay không
  @ArrayNotEmpty() // Kiểm tra xem mảng không được rỗng
  images: string[]; // lưu trữ đường dẫn hoặc tên file ảnh

  @IsString() // Kiểm tra xem content có phải là một chuỗi hay không
  @IsNotEmpty() // Kiểm tra xem content không được để trống
  content: string; // nội dung bài viết

  @IsString() // Kiểm tra xem tag có phải là một chuỗi hay không
  @IsNotEmpty() // Kiểm tra xem tag không được để trống
  tag: string; //
}
