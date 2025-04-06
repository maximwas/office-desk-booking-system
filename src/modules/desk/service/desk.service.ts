import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { BookingRepository } from 'src/modules/booking/repository/booking.repository';
import dayjs, { generateTimeSlots, getStartAndEndOfDay } from 'src/shared/utils/dayjs';

import { DeskRepository } from '../repository/desk.repository';
import { CreateDeskInput, UpdateDeskInput } from '../types/desk.dto';

@Injectable()
export class DeskService {
  constructor(
    private readonly configService: ConfigService,
    private readonly deskRepo: DeskRepository,
    private readonly bookingRepo: BookingRepository,
  ) {}

  public async create(body: CreateDeskInput) {
    const desk = await this.deskRepo.create(body);

    return desk;
  }

  public async update(id: string, body: UpdateDeskInput) {
    await this.verifyNumberDesk(body.number);

    const desk = await this.deskRepo.updateById(id, {
      $set: {
        ...body,
      },
    });

    return desk;
  }

  public async updateBookingHistory(id: string, bookingId: string) {
    await this.deskRepo.updateById(id, {
      $push: {
        bookings: new Types.ObjectId(bookingId),
      },
    });
  }

  public async delete(id: string) {
    const desk = await this.deskRepo.delete(id);

    return desk;
  }

  public async deleteAll() {
    const desk = await this.deskRepo.deleteAll();

    return desk;
  }

  public async verifyNumberDesk(number?: number) {
    if (!number) return null;

    const desk = await this.deskRepo.findByNumber(number);

    if (desk) {
      throw new ConflictException('Desk with this number already exists');
    }
  }

  public async getTimeFreeSlots(deskId: string, date: Date) {
    const { startOfDay, endOfDay } = getStartAndEndOfDay(date);

    const bookings = await this.bookingRepo.findByDeskAndPeriod(deskId, startOfDay, endOfDay);

    if (!bookings.length) {
      throw new NotFoundException('No available slots for the selected date and desk');
    }

    const slots = generateTimeSlots({
      intervalMinutes: parseInt(this.configService.getOrThrow<string>('BOOKING_INTERVAL_MINUTES')),
      busySlots: bookings.map((booking) => ({
        startDate: booking.startDate,
        endDate: booking.endDate,
      })),
      periodStart: dayjs
        .utc(startOfDay)
        .set('hour', parseInt(this.configService.getOrThrow<string>('BOOKING_PERIOD_START')))
        .set('minute', 0)
        .toDate(),
      periodEnd: dayjs
        .utc(endOfDay)
        .set('hour', parseInt(this.configService.getOrThrow<string>('BOOKING_PERIOD_END')))
        .set('minute', 0)
        .toDate(),
    });

    return slots;
  }
}
