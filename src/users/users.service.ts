import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';
import { Users } from './users.schema';
import { UsersPayload } from './user.payload';
import { CreateUserInput } from './users.input';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private usersModel: Model<Users>) {}

  public async create(body: CreateUserInput): Promise<UsersPayload> {
    try {
      const hashPassword = hash(body.password, 10);
      const user = new this.usersModel({
        ...body,
        password: hashPassword,
      });

      return await user.save();
    } catch {
      throw new ConflictException('User with this email already exists');
    }
  }

  public async findByEmail(email: string): Promise<UsersPayload | null> {
    const user = await this.usersModel.findOne({ email }).exec();

    return user;
  }
}
