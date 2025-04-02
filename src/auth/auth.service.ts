import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from './auth.payload';
import { UsersService } from 'src/users/users.service';
import { compareSync } from 'bcrypt';
import { CreateUserInput, LoginUserInput, UserData } from 'src/users/users.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateEmail(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      throw new ConflictException('A user with this email already exists');
    }

    return;
  }

  public async validateUser(
    email: string,
    password: string,
  ): Promise<UserData> {
    const user = await this.usersService.findByEmail(email);

    if (user && compareSync(password, user.password)) {
      return {
        email: user.email,
        fullName: user.fullName,
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  public async register(userInput: CreateUserInput): Promise<AuthPayload> {
    await this.validateEmail(userInput.email);

    const user = await this.usersService.create(userInput);
    const jwtToken = await this.jwtService.signAsync({
      email: user.email,
      fullName: user.fullName,
    });

    return {
      access_token: jwtToken,
    };
  }

  public async login(
    userInput: LoginUserInput,
  ): Promise<UserData & AuthPayload> {
    const user = await this.validateUser(userInput.email, userInput.password);
    const jwtToken = await this.jwtService.signAsync(user);

    return {
      access_token: jwtToken,
      ...user,
    };
  }
}
