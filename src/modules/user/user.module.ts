import { Module } from '@nestjs/common';

import { UserServiceModule } from './service/user-service.module';
import { UsersController } from './user.controller';

@Module({
  imports: [UserServiceModule],
  controllers: [UsersController],
})
export class UserModule {}
