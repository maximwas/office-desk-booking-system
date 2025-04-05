import { OmitType } from '@nestjs/mapped-types';
import { IsDate, IsEmail, IsOptional, IsString, Length } from 'class-validator';

import { User } from '../schema/user.schema';

export class UserPayload extends User {
  @IsDate()
  @IsOptional()
  createdA?: string;

  @IsDate()
  @IsOptional()
  updateAt?: string;
}

export class CreateUserInput {
  @IsString()
  @Length(3, 50)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;
}

export class LoginUserInput extends OmitType(CreateUserInput, ['fullName'] as const) {}
