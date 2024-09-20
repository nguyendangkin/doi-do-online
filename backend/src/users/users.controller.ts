import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateUserDto } from 'src/users/dto/updateUser.dto';
import { UsersService } from 'src/users/users.service';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile/:email')
  @Roles(Role.User, Role.Admin)
  async getUser(@Param('email') email: string) {
    return this.usersService.getUser(email);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('profile')
  @Roles(Role.User, Role.Admin)
  async updateUser(@Body() updateUser: UpdateUserDto) {
    console.log(updateUser);

    return 1;
  }
}
