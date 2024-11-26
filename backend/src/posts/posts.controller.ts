import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { User } from 'src/auth/decorators/getCuttentUser.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { tagsProducts } from 'src/posts/data/tags';
import { CreatePostDto } from 'src/posts/dto/postDto.dto';
import { UpdatePostDto } from 'src/posts/dto/updateDto.dto copy';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';

@Controller('posts')
export class PostsController {
  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.User, Role.Admin)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/jpg',
          'image/webp',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException('File ảnh không hợp lệ!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async createPost(
    @User() user: { email: string },
    @Body() createPostData: CreatePostDto,
    @UploadedFiles() images: Array<Express.Multer.File>, // Chắc chắn rằng bạn sử dụng @UploadedFiles() để nhận nhiều file
  ) {
    console.log(createPostData); // Kiểm tra lại log của content
    console.log(images); // Log danh sách file
    return this.postsService.createPost(user, createPostData, images);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.User, Role.Admin)
  async getPosts(@User() user: { email: string }) {
    return this.postsService.getPosts(user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('tags')
  @Roles(Role.User, Role.Admin)
  async getAllTag(@User() user: { email: string }) {
    return tagsProducts;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put()
  @Roles(Role.User, Role.Admin)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/jpg',
          'image/webp',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException('File ảnh không hợp lệ!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async updatePost(
    @User() user: { email: string },
    @Body() updatePostData: UpdatePostDto,
    @UploadedFiles() images: Array<Express.Multer.File>, // Chắc chắn rằng bạn sử dụng @UploadedFiles() để nhận nhiều file
  ) {
    console.log(updatePostData); // Kiểm tra lại log của content
    console.log(images); // Log danh sách file
    return this.postsService.updatePost(user, updatePostData, images);
  }
}
