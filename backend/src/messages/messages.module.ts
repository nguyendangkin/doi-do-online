import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/messages/entity/messages.entity';
import { MessageService } from 'src/messages/messages.service';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), ChatsModule],
  controllers: [MessagesController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessagesModule {}
