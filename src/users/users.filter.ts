import { IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UsersFilter {
  @IsOptional()
  @IsString()
  id: Types.ObjectId;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  email?: string;
}
