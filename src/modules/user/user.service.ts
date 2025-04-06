import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Model, Types, UpdateQuery } from 'mongoose';

import { User } from './schema/user.schema';
import { CreateUserInput, UserPayload } from './types/user.dto';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async create(body: CreateUserInput): Promise<UserPayload> {
    const hashPassword = await hash(body.password, 10);
    const user = new this.userModel({
      ...body,
      password: hashPassword,
    });

    return await user.save();
  }

  async updateById(id: string, data: UpdateQuery<User>) {
    return await this.userModel.findOneAndUpdate({ _id: new Types.ObjectId(id) }, data);
  }

  public async findByEmail(email: string): Promise<UserPayload | null> {
    const user = await this.userModel.findOne({ email }).exec();

    return user;
  }

  public async findById(id: string): Promise<UserPayload | null> {
    const user = await this.userModel.findOne({ _id: new Types.ObjectId(id) }).exec();

    return user;
  }

  public async getAll(): Promise<UserPayload[] | null> {
    const user = await this.userModel.find().exec();

    return user;
  }
}
