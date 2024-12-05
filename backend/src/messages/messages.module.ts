import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/messages/entity/messages.entity';
import { MessageService } from 'src/messages/messages.service';
import { ChatsModule } from 'src/chats/chats.module';
import { UsersModule } from 'src/users/users.module';
import { Users } from 'src/users/entity/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Users]),
    ChatsModule,
    UsersModule,
  ],
  controllers: [MessagesController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessagesModule {}
