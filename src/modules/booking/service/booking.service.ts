import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { DeskRepository } from 'src/modules/desk/repository/desk.repository';

import { BookingRepository } from '../repository/booking.repository';
import { CreateBookingInput } from '../types/booking.dto';

@Injectable()
export class BookingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly bookingRep: BookingRepository,
    private readonly deskRep: DeskRepository,
  ) {}

  public async create(body: CreateBookingInput) {
    const { userId, deskId } = body;

    await this.checkBooking(body);

    const booking = await this.bookingRep.create({
      ...body,
      userId: new Types.ObjectId(userId),
      deskId: new Types.ObjectId(deskId),
    });

    await this.deskRep.updateBookingHistory(deskId.toString(), booking._id.toString());

    return booking;
  }

  public async checkBooking(body: CreateBookingInput) {
    const { userId, deskId, startDate, endDate } = body;
    const bookingMaxPeriod = parseInt(this.configService.getOrThrow<string>('BOOKING_MAX_PERIOD'));
    const bookingAllDay = await this.bookingRep.findByUserAndAllDay(userId.toString(), startDate, endDate);
    const bookingPeriodDay = await this.bookingRep.findByDeskAndPeriod(deskId.toString(), startDate, endDate);

    if (bookingAllDay.length >= bookingMaxPeriod) {
      throw new ConflictException(`More than ${bookingMaxPeriod} desk booked`);
    }

    if (bookingPeriodDay.length) {
      throw new ConflictException('Desk is already booked for this time');
    }
  }
}
