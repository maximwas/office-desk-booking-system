import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller({
  path: 'users',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
