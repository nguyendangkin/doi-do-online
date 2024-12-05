import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from 'src/messages/entity/messages.entity';
import { ChatService } from 'src/chats/chats.service';
import { Users } from 'src/users/entity/users.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly chatService: ChatService, // Dùng để cập nhật Chat
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  // Lấy danh sách tin nhắn thuộc một cuộc hội thoại
  async findMessagesByChat(chatId: number): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { chat: { id: chatId } },
      order: { timestamp: 'ASC' }, // Sắp xếp tin nhắn từ cũ đến mới
    });
  }

  // Tạo tin nhắn mới
  async createMessage(
    chatId: number,
    senderId: number, // Change from 'me' | 'other' to number
    content: string,
    type: 'text' | 'image' | 'multiple-images',
  ): Promise<Message> {
    const chat = await this.chatService.findOne(chatId);
    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });

    if (!chat) throw new Error('Chat not found');
    if (!sender) throw new Error('Sender not found');

    const newMessage = this.messageRepository.create({
      content,
      sender,
      type,
      chat,
    });

    const savedMessage = await this.messageRepository.save(newMessage);
    await this.chatService.updateChat(chatId, content, chat.unread + 1);

    return savedMessage;
  }

  // Xóa tin nhắn
  async deleteMessage(messageId: number): Promise<void> {
    await this.messageRepository.delete(messageId);
  }
}
