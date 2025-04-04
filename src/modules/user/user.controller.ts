import { Controller } from '@nestjs/common';
import { UserService } from './user.service';

@Controller({
  version: '1',
})
export class UsersController {
  constructor(private readonly userService: UserService) {}
}
