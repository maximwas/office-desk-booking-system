import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery, Types, UpdateQuery } from 'mongoose';
import { getStartAndEndOfDay } from 'src/shared/utils/dayjs';

import { Booking, BookingDocument } from '../schema/booking.schema';

@Injectable()
export class BookingRepository {
  constructor(@InjectModel(Booking.name) private bookingModel: Model<BookingDocument>) {}

  public async create(data: Partial<Booking>) {
    const booking = new this.bookingModel(data);
    return booking.save();
  }

  public async findById(id: string) {
    const booking = await this.bookingModel.findById(new Types.ObjectId(id)).exec();

    return booking;
  }

  public async updateById(id: string, data: UpdateQuery<Booking>) {
    const booking = await this.bookingModel.findByIdAndUpdate(new Types.ObjectId(id), data, { new: true }).exec();

    return booking;
  }

  public async findByUserAndAllDay(userId: string, startDate: Date, endDate: Date) {
    const { startOfDay, endOfDay } = getStartAndEndOfDay(startDate, endDate);

    const bookingAllDay = await this.bookingModel
      .find({
        userId: new Types.ObjectId(userId),
        startDate: { $lte: endOfDay },
        endDate: { $gte: startOfDay },
      })
      .exec();

    return bookingAllDay;
  }

  public async findByDeskAndPeriod(deskId: string, startDate: Date, endDate: Date, excludeBookingId?: string) {
    const query: RootFilterQuery<Booking> = {
      deskId: new Types.ObjectId(deskId),
      startDate: { $lt: endDate },
      endDate: { $gt: startDate },
    };

    if (excludeBookingId) {
      query._id = { $ne: new Types.ObjectId(excludeBookingId) };
    }

    const bookingPeriodDay = await this.bookingModel.find(query).exec();

    return bookingPeriodDay;
  }
}
