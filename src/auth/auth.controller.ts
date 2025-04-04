import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserInput } from 'src/user/types/user.dto';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { OptionalAuthGuard } from './guard/optional-auth.guard';

@Controller({
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(OptionalAuthGuard)
  @Post('/register')
  register(
    @Body() body: CreateUserInput,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    return this.authService.register(body, res);
  }

  @UseGuards(OptionalAuthGuard, LocalAuthGuard)
  @Post('/login')
  login(
    @Request() req: ExpressRequest,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    return this.authService.login(req.user, res);
  }

  @Post('/logout')
  logout(@Request() req: ExpressRequest) {
    return req.logout(() => {});
  }
}
