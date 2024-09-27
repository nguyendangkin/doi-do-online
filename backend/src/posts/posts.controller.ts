import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/decorators/getCuttentUser.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreatePostDto } from 'src/posts/dto/postDto.dto';
import { UsersService } from 'src/users/users.service';

@Controller('posts')
export class PostsController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.User, Role.Admin)
  async createPost(
    @User() user: { email: string },
    @Body() createPostData: CreatePostDto,
  ) {
    console.log(createPostData);

    return 1;
  }
}
