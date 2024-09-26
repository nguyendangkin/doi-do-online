import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/decorators/getCuttentUser.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UsersService } from 'src/users/users.service';

@Controller('posts')
export class PostsController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile')
  @Roles(Role.User, Role.Admin)
  async createPost(@User() user: { email: string }) {
    return 1;
  }
}
