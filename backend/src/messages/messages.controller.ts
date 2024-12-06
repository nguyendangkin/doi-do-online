import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/auth/decorators/getCuttentUser.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateMessageDto } from 'src/messages/dto/messages.dto';
import { MessageService } from 'src/messages/messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':chatId')
  @Roles(Role.User, Role.Admin)
  createMessage(
    @Param('chatId') chatId: number,
    @Body() messageDto: CreateMessageDto,
    @Request() req, // Get the authenticated user from the request
  ) {
    const { content, type } = messageDto;
    // Use the authenticated user's ID instead of relying on the sent senderId
    return this.messageService.createMessage(
      chatId,
      req.user.id,
      content,
      type,
    );
  }
}
