import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { AuthPayload } from './types/auth.payload';
import { CreateUserInput, UserData } from 'src/modules/user/types/user.dto';
import { UserService } from 'src/modules/user/user.service';
import { Response } from 'express';
import { COOKIE_REFRESH_TOKEN } from 'src/core/constants';
import { ConfigService } from '@nestjs/config';
import { isDev } from 'src/shared/utils/is-dev.until';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async verifyToken(token: string): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync<UserData>(token);
      const userExists = await this.userService.findByEmail(payload.email);

      return !!userExists;
    } catch {
      return false;
    }
  }

  public async verifyEmail(email: string) {
    const user = await this.userService.findByEmail(email);

    if (user) {
      throw new ConflictException('A user with this email already exists');
    }

    return;
  }

  public async verifyUser(
    email: string,
    password: string,
  ): Promise<UserData | null> {
    const user = await this.userService.findByEmail(email);

    if (user && (await compare(password, user.password))) {
      return {
        _id: user._id,
        email: user.email,
      };
    }

    return null;
  }

  public async register(
    userInput: CreateUserInput,
    res: Response,
  ): Promise<AuthPayload> {
    await this.verifyEmail(userInput.email);

    const user = await this.userService.create(userInput);

    return await this.login(
      {
        _id: user._id,
        email: user.email,
      },
      res,
    );
  }

  public async login(user: UserData, res: Response): Promise<AuthPayload> {
    const jwtToken = await this.jwtService.signAsync(user, {
      expiresIn: this.configService.getOrThrow<string>('JWT_TOKEN_TIME'),
    });

    await this.createRefreshToken(user, res);

    return {
      access_token: jwtToken,
    };
  }

  private async createRefreshToken(user: UserData, res: Response) {
    const expiresRefreshToken = new Date();
    expiresRefreshToken.setTime(
      expiresRefreshToken.getTime() +
        parseInt(
          this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_TIME'),
          10,
        ) *
          1000,
    );

    const refreshToken = await this.jwtService.signAsync(user, {
      expiresIn: process.env.JWT_TOKEN_TIME,
    });

    await this.userService.update(
      { _id: user._id },
      { $set: { refreshToken: await hash(refreshToken, 10) } },
    );

    res.cookie(COOKIE_REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: !isDev(this.configService),
      expires: expiresRefreshToken,
    });
  }
}
