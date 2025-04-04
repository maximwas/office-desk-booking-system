import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { hash } from 'bcrypt';
import { User } from './schema/user.schema';
import { UserPayload, CreateUserInput } from './types/user.dto';
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

  async update(query: FilterQuery<User>, data: UpdateQuery<User>) {
    return await this.userModel.findOneAndUpdate(query, data);
  }

  public async findByEmail(email: string): Promise<UserPayload | null> {
    const user = await this.userModel.findOne({ email }).exec();

    return user;
  }
}
