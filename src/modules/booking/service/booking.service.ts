import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { BOOKING_CONFIG, BookingConfig } from 'src/core/config/booking.config';
import { DeskRepository } from 'src/modules/desk/repository/desk.repository';
import { Transactional } from 'src/shared/decorators/transactional.decorator';

import { BookingRepository } from '../repository/booking.repository';
import { CreateBookingInput, UpdateBookingInput } from '../types/booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @Inject(BOOKING_CONFIG) private readonly bookingConfig: BookingConfig,
    @InjectConnection() private readonly connection: Connection,
    private readonly bookingRep: BookingRepository,
    private readonly deskRep: DeskRepository,
  ) {}

  @Transactional()
  public async create(body: CreateBookingInput) {
    await this.validateBookingForCreation(body);

    const { userId, deskId } = body;
    const booking = await this.bookingRep.create({
      ...body,
      userId: new Types.ObjectId(userId),
      deskId: new Types.ObjectId(deskId),
    });

    await this.deskRep.addBookingHistory(deskId.toString(), booking._id.toString());

    return booking;
  }

  public async updateById(id: string, body: UpdateBookingInput) {
    await this.validateBookingForUpdate(id, body);

    const updateBooking = await this.bookingRep.updateById(id, {
      startDate: body.startDate,
      endDate: body.endDate,
    });

    if (!updateBooking) {
      throw new NotFoundException('Booking not found');
    }

    return updateBooking;
  }

  @Transactional()
  public async deleteById(id: string) {
    const booking = await this.bookingRep.deleteById(id);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    await this.deskRep.removeBookingHistory(id, booking._id.toString());

    return booking;
  }

  public async validateBookingForCreation(body: CreateBookingInput) {
    const { userId, deskId, startDate, endDate } = body;
    const bookingAllDay = await this.bookingRep.findByUserAndAllDay(userId.toString(), startDate, endDate, this.bookingConfig.maxPeriod);
    const conflictingBookings = await this.bookingRep.findByDeskAndPeriod(deskId.toString(), startDate, endDate);

    if (bookingAllDay && bookingAllDay.length >= this.bookingConfig.maxPeriod) {
      throw new ConflictException(`More than ${this.bookingConfig.maxPeriod} desk booked`);
    }

    if (conflictingBookings && conflictingBookings.length) {
      throw new ConflictException('Desk is already booked for this time');
    }
  }

  public async validateBookingForUpdate(id: string, body: UpdateBookingInput) {
    const { deskId, startDate, endDate } = body;
    const currentBooking = await this.bookingRep.findById(id);

    if (!currentBooking) {
      throw new NotFoundException('Booking not found');
    }

    const conflictingBookings = await this.bookingRep.findByDeskAndPeriod(deskId.toString(), startDate, endDate, id);

    if (conflictingBookings && conflictingBookings.length) {
      throw new ConflictException('The desk you selected is already reserved during this time. Please choose another time.');
    }
  }
}
