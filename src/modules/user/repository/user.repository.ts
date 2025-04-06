import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';

import { User, UserDocument } from '../schema/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async create(data: Partial<User>) {
    const user = new this.userModel(data);

    return await user.save();
  }

  async updateById(id: string, data: UpdateQuery<User>) {
    return await this.userModel.findOneAndUpdate({ _id: new Types.ObjectId(id) }, data);
  }

  public async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();

    return user;
  }

  public async findById(id: string) {
    const user = await this.userModel.findOne({ _id: new Types.ObjectId(id) }).exec();

    return user;
  }

  public async findAll() {
    const user = await this.userModel.find().exec();

    return user;
  }
}
