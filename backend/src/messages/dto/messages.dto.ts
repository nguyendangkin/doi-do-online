export class CreateMessageDto {
  senderId: number; // Change from sender: 'me' | 'other'
  content: string;
  type: 'text' | 'image' | 'multiple-images';
}
