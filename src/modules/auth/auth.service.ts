import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { Response } from 'express';
import { COOKIE_REFRESH_TOKEN } from 'src/core/constants';
import { CreateUserInput } from 'src/modules/user/types/user.dto';
import { UserService } from 'src/modules/user/user.service';
import { isDev } from 'src/shared/utils/is-dev.until';

import { AuthPayload } from './types/auth.payload';
import { TokenPayload } from './types/token.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async verifyEmail(email: string) {
    const user = await this.userService.findByEmail(email);

    if (user) {
      throw new ConflictException('A user with this email already exists');
    }

    return;
  }

  public async verifyUser(email: string, password: string): Promise<TokenPayload | null> {
    const user = await this.userService.findByEmail(email);

    if (user && (await compare(password, user.password))) {
      return {
        userId: user._id.toString(),
      };
    }

    return null;
  }

  public async verifyUserRefreshToken(refreshToken: string, payload: TokenPayload): Promise<TokenPayload> {
    const user = await this.userService.findById(payload.userId);

    if (user && user.refreshToken) {
      const authenticated = await compare(refreshToken, user.refreshToken);

      if (!authenticated) {
        throw new UnauthorizedException('Refresh token is not valid');
      }
    }

    return {
      userId: payload.userId,
    };
  }

  public async register(userInput: CreateUserInput, res: Response): Promise<void | AuthPayload> {
    await this.verifyEmail(userInput.email);

    const user = await this.userService.create(userInput);

    return await this.login(
      {
        userId: user._id.toString(),
      },
      res,
    );
  }

  public async login(user: TokenPayload, res: Response, redirect?: boolean): Promise<void | AuthPayload> {
    const jwtToken = await this.jwtService.signAsync(user, {
      expiresIn: `${this.configService.getOrThrow<string>('JWT_TOKEN_TIME')}s`,
    });

    await this.createRefreshToken(user, res);

    if (redirect) {
      return res.redirect(this.configService.getOrThrow<string>('PATH_HOME_PAGE'));
    }

    return {
      access_token: jwtToken,
    };
  }

  public logout(res: Response) {
    res.clearCookie(COOKIE_REFRESH_TOKEN);

    return null;
  }

  private async createRefreshToken(user: TokenPayload, res: Response) {
    const expiresRefreshToken = new Date();
    expiresRefreshToken.setTime(expiresRefreshToken.getTime() + parseInt(this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_TIME'), 10) * 1000);

    const refreshToken = await this.jwtService.signAsync(user, {
      expiresIn: `${this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_TIME')}s`,
    });

    await this.userService.updateById(user.userId, { $set: { refreshToken: await hash(refreshToken, 10) } });

    res.cookie(COOKIE_REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: !isDev(this.configService),
      expires: expiresRefreshToken,
    });
  }
}
