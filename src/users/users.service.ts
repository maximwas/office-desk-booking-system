import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';
import { Users } from './users.schema';
import { UserPayload, CreateUserInput } from './users.dto';
@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private usersModel: Model<Users>) {}

  public async create(body: CreateUserInput): Promise<UserPayload> {
    const hashPassword = await hash(body.password, 10);
    const user = new this.usersModel({
      ...body,
      password: hashPassword,
    });

    return await user.save();
  }

  public async findByEmail(email: string): Promise<UserPayload | null> {
    const user = await this.usersModel.findOne({ email }).exec();

    return user;
  }
}
