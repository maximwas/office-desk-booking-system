import { PartialType } from '@nestjs/swagger';
import { Users } from './users.schema';

export class UsersPayload extends PartialType(Users) {
  createdA?: string;
  updateAt?: string;
}
