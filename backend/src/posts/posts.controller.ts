import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
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
  async getPosts(
    @User() user: { email: string },
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.postsService.getPosts(user, page, limit);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('tags')
  @Roles(Role.User, Role.Admin)
  async getAllTag(@User() user: { email: string }) {
    return tagsProducts;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
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
    @User() user,
    @Param('id', ParseIntPipe) idPost: number,
    @Body() updatePostData: UpdatePostDto,
    @UploadedFiles() images: Array<Express.Multer.File>, // Chắc chắn rằng bạn sử dụng @UploadedFiles() để nhận nhiều file
  ) {
    let existingImages: string[] = [];
    if (updatePostData.existingImages) {
      try {
        existingImages = JSON.parse(updatePostData.existingImages);
      } catch (error) {
        throw new BadRequestException('Invalid existingImages format');
      }
    }

    return this.postsService.updatePost(
      idPost,
      user,
      updatePostData,
      images,
      existingImages,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.User, Role.Admin)
  async deletePost(@User() user, @Param('id', ParseIntPipe) idPost: number) {
    return this.postsService.deletePost(idPost, user);
  }
}
