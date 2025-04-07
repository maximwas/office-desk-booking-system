import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types, UpdateQuery } from 'mongoose';

import { Desk, DeskDocument } from '../schema/desk.schema';

@Injectable()
export class DeskRepository {
  constructor(@InjectModel(Desk.name) private deskModel: Model<DeskDocument>) {}

  public async create(data: Partial<Desk>) {
    const desk = new this.deskModel(data);

    return await desk.save();
  }

  public async deleteById(id: string, session?: ClientSession) {
    const desk = await this.deskModel.findByIdAndDelete({ _id: new Types.ObjectId(id) }, { session }).exec();

    return desk;
  }

  public async deleteAll() {
    const desk = await this.deskModel.deleteMany({}).exec();

    return desk;
  }

  public async addBookingHistory(id: string, bookingId: string) {
    const desk = await this.update(id, {
      $push: {
        bookings: new Types.ObjectId(bookingId),
      },
    });

    return desk;
  }

  public async removeBookingHistory(id: string, bookingId: string) {
    const desk = await this.update(id, {
      $pull: {
        bookings: new Types.ObjectId(bookingId),
      },
    });

    return desk;
  }

  public async updateById(id: string, data: Partial<Desk>) {
    const desk = await this.update(id, data);

    return desk;
  }

  public async update(id: string, data: UpdateQuery<Desk>) {
    const desk = await this.deskModel.findByIdAndUpdate(new Types.ObjectId(id), data, { new: true }).exec();

    return desk;
  }

  public async findByNumber(number: number) {
    const desk = await this.deskModel.findOne({ number }).exec();

    return desk;
  }

  public async findById(id: string) {
    const desk = await this.deskModel.findOne({ _id: new Types.ObjectId(id) }).exec();

    return desk;
  }
}
