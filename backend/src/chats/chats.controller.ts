import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/auth/decorators/getCuttentUser.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ChatService } from 'src/chats/chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.User, Role.Admin)
  findUserChats(@Request() req, @User() user) {
    return this.chatService.findUserChats(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('seller/:sellerId/post/:postId')
  @Roles(Role.User, Role.Admin)
  getChatWithSellerAndPost(
    @Request() req,
    @Param('sellerId') sellerId: number,
    @Param('postId') postId: number,
    @User() user,
  ) {
    return this.chatService.findOrCreateChatWithSellerAndPost(
      req.user.id,
      sellerId,
      postId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(Role.User, Role.Admin)
  async findOne(@Param('id') id: number, @Request() req, @User() user) {
    const chat = await this.chatService.findOne(id);

    if (!chat) {
      throw new Error('Chat not found');
    }

    if (chat.sender.id !== req.user.id && chat.receiver.id !== req.user.id) {
      throw new ForbiddenException('You do not have access to this chat');
    }

    return chat;
  }
}
