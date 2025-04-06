import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';

import { Desk, DeskDocument } from '../schema/desk.schema';

@Injectable()
export class DeskRepository {
  constructor(@InjectModel(Desk.name) private deskModel: Model<DeskDocument>) {}

  public async create(data: Partial<Desk>) {
    const desk = new this.deskModel(data);
    return await desk.save();
  }

  public async delete(id: string) {
    const desk = await this.deskModel.deleteOne({ _id: new Types.ObjectId(id) }).exec();

    return desk;
  }

  public async deleteAll() {
    const desk = await this.deskModel.deleteMany({}).exec();

    return desk;
  }

  public async updateBookingHistory(id: string, bookingId: string) {
    await this.updateById(id, {
      $push: {
        bookings: new Types.ObjectId(bookingId),
      },
    });
  }

  public async updateById(id: string, data: UpdateQuery<Desk>) {
    const desk = await this.deskModel.findByIdAndUpdate(new Types.ObjectId(id), data, { new: true }).exec();

    return desk;
  }

  public async findByNumber(number: number) {
    const desk = await this.deskModel.findOne({ number }).exec();

    return desk;
  }
}
