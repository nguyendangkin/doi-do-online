export class CreateMessageDto {
  sender: 'me' | 'other';
  content: string;
  type: 'text' | 'image' | 'multiple-images';
}
