import { Body, Controller, Get } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('profile')
  async getUser(@Body('email') email: string) {
    return this.usersService.getUser(email);
  }
}
