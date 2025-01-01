export class CreateMessageDto {
  content: string;
  type: 'text' | 'image' | 'multiple-images';
}
