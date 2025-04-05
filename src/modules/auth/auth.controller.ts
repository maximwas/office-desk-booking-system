import { Body, Controller, Post, Response, UseGuards } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { CreateUserInput } from 'src/modules/user/types/user.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

import { AuthService } from './auth.service';
import { JwtRefreshAuthGuard } from './guard/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { TokenPayload } from './types/token.payload';

@Controller({
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() body: CreateUserInput, @Response({ passthrough: true }) res: ExpressResponse) {
    return this.authService.register(body, res);
  }

  @Post('/refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(@CurrentUser() user: TokenPayload, @Response({ passthrough: true }) res: ExpressResponse) {
    await this.authService.login(user, res, true);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@CurrentUser() user: TokenPayload, @Response({ passthrough: true }) res: ExpressResponse) {
    return this.authService.login(user, res);
  }

  @Post('/logout')
  logout(@Response({ passthrough: true }) res: ExpressResponse) {
    return this.authService.logout(res);
  }
}
