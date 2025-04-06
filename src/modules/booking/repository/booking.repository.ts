import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { getStartAndEndOfDay } from 'src/shared/utils/dayjs';

import { Booking, BookingDocument } from '../schema/booking.schema';

@Injectable()
export class BookingRepository {
  constructor(@InjectModel(Booking.name) private bookingModel: Model<BookingDocument>) {}

  async create(data: Partial<Booking>) {
    const booking = new this.bookingModel(data);
    return booking.save();
  }

  async findByUserAndAllDay(userId: string, startDate: Date, endDate: Date) {
    const { startOfDay, endOfDay } = getStartAndEndOfDay(startDate, endDate);

    const bookingAllDay = await this.bookingModel
      .find({
        userId: new Types.ObjectId(userId),
        $or: [
          {
            startDate: { $lte: endOfDay },
            endDate: { $gte: startOfDay },
          },
        ],
      })
      .exec();

    return bookingAllDay;
  }

  async findByDeskAndPeriod(deskId: string, startDate: Date, endDate: Date) {
    const bookingPeriodDay = await this.bookingModel.find({
      deskId: new Types.ObjectId(deskId),
      $or: [
        {
          startDate: { $lt: endDate },
          endDate: { $gt: startDate },
        },
      ],
    });

    return bookingPeriodDay;
  }
}
