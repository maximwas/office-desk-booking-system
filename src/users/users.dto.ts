import { Users } from './users.schema';
import { OmitType } from '@nestjs/mapped-types';
import { IsDate, IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UserPayload extends Users {
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

export class LoginUserInput extends OmitType(CreateUserInput, [
  'fullName',
] as const) {}

export class UserData extends OmitType(Users, ['password'] as const) {}
