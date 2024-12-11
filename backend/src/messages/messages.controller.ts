import { MessageService } from 'src/messages/messages.service';
import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

import { CreateMessageDto } from 'src/messages/dto/messages.dto';
import { FileUploadService } from 'src/messages/FileUploadService';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messageService: MessageService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':chatId/images')
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadImages(
    @Param('chatId') chatId: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    const imageUrls = await this.fileUploadService.uploadImages(files);

    const type = imageUrls.length === 1 ? 'image' : 'multiple-images';
    const content = JSON.stringify(imageUrls);

    return this.messageService.createMessage(
      chatId,
      req.user.id,
      content,
      type,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':chatId')
  @Roles(Role.User, Role.Admin)
  async createMessage(
    @Param('chatId') chatId: number,
    @Body() messageDto: CreateMessageDto,
    @Request() req,
  ) {
    const { content, type } = messageDto;
    return this.messageService.createMessage(
      chatId,
      req.user.id,
      content,
      type,
    );
  }
}
