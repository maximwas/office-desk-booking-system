import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UserServiceModule } from '../user/service/user-service.module';
import { AuthController } from './auth.controller';
import { AuthServiceModule } from './service/auth-service.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [AuthServiceModule, UserServiceModule, PassportModule],
  controllers: [AuthController],
  providers: [LocalStrategy, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
