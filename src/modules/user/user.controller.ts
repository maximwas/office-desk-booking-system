import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserService } from './service/user.service';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    return this.userService.getAll();
  }
}
