import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersFilter } from './users.filter';

@Controller({
  path: 'users',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  get(@Query() query: UsersFilter) {
    return Object.keys(query).length
      ? this.usersService.get(query)
      : this.usersService.getAll();
  }
}
