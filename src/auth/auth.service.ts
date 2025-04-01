import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from 'src/users/users.input';
import { AuthPayload } from './auth.payload';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(body: CreateUserInput): Promise<AuthPayload> {
    const user = await this.usersService.create(body);
    const jwtToken = this.jwtService.sign({
      email: user.email,
      fullName: user.fullName,
    });

    return {
      access_token: jwtToken,
    };
  }
}
