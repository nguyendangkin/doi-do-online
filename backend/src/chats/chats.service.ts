import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from 'src/chats/entity/chats.entity';
import { Users } from 'src/users/entity/users.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  // Tìm hoặc tạo chat với seller
  async findOrCreateChatWithSellerAndPost(
    currentUserId: number,
    sellerId: number,
    postId: number,
  ): Promise<Chat> {
    // Find existing chat for this post
    let chat = await this.chatRepository.findOne({
      where: [
        {
          sender: { id: currentUserId },
          receiver: { id: sellerId },
          post: { id: postId },
        },
        {
          sender: { id: sellerId },
          receiver: { id: currentUserId },
          post: { id: postId },
        },
      ],
      relations: ['sender', 'receiver', 'messages', 'messages.sender', 'post'],
      order: {
        messages: {
          timestamp: 'ASC',
        },
      },
    });

    // If no chat exists, create one
    if (!chat) {
      const [sender, receiver] = await Promise.all([
        this.userRepository.findOneBy({ id: currentUserId }),
        this.userRepository.findOneBy({ id: sellerId }),
      ]);

      if (!sender || !receiver) {
        throw new Error('User not found');
      }

      chat = this.chatRepository.create({
        sender,
        receiver,
        post: { id: postId }, // Associate with post
        lastMessage: '',
        timestamp: new Date(),
        unread: 0,
      });

      await this.chatRepository.save(chat);
    }

    return chat;
  }

  async findOne(id: number): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver', 'messages', 'messages.sender'],
      order: {
        messages: {
          timestamp: 'ASC',
        },
      },
    });

    return chat;
  }

  // Lấy danh sách chat của user
  async findUserChats(userId: number): Promise<Chat[]> {
    return await this.chatRepository.find({
      where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
      relations: ['sender', 'receiver', 'messages', 'messages.sender'],
      order: { timestamp: 'DESC' },
    });
  }

  async updateChat(
    chatId: number,
    lastMessage: string,
    unread: number,
  ): Promise<void> {
    await this.chatRepository.update(
      { id: chatId },
      {
        lastMessage,
        unread,
        timestamp: new Date(), // Cập nhật thời gian cuối cùng của chat
      },
    );
  }
}
