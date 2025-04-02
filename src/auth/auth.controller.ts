import { Body, Controller, Get, Post, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserInput, LoginUserInput } from 'src/users/users.dto';
import { Response as ExpressResponse } from 'express';
import { COOKIE_JWT_NAME } from 'src/constants';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(
    @Body() body: CreateUserInput,
    @Response() res: ExpressResponse,
  ) {
    const { access_token } = await this.authService.register(body);

    res.cookie(COOKIE_JWT_NAME, access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    return res.json({ message: 'Registered successfully' });
  }

  @Post('/login')
  async login(@Body() body: LoginUserInput, @Response() res: ExpressResponse) {
    const { access_token, ...user } = await this.authService.login(body);

    res.cookie(COOKIE_JWT_NAME, access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    return res.json({ message: 'Logged in successfully', ...user });
  }

  @Get('/logout')
  logout(@Response() res: ExpressResponse) {
    res.clearCookie(COOKIE_JWT_NAME);

    return res.json({ message: 'Logged out successfully' });
  }
}
