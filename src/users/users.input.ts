import { IsEmail, IsString, Length } from 'class-validator';

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
