import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/chats/entity/chats.entity';
import { ChatService } from 'src/chats/chats.service';
import { UsersModule } from 'src/users/users.module';
import { Users } from 'src/users/entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Users]), UsersModule],
  providers: [ChatService],
  controllers: [ChatsController],
  exports: [ChatService],
})
export class ChatsModule {}
