import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';
import { BOOKING_CONFIG, BookingConfig } from 'src/core/config/booking.config';
import { BookingRepository } from 'src/modules/booking/repository/booking.repository';
import { Transactional } from 'src/shared/decorators/transactional.decorator';
import dayjs, { generateTimeSlots, getStartAndEndOfDay } from 'src/shared/utils/dayjs';

import { DeskRepository } from '../repository/desk.repository';
import { CreateDeskInput, UpdateDeskInput } from '../types/desk.dto';

@Injectable()
export class DeskService {
  constructor(
    @Inject(BOOKING_CONFIG) private readonly bookingConfig: BookingConfig,
    @InjectConnection() private readonly connection: Connection,
    private readonly deskRepo: DeskRepository,
    private readonly bookingRepo: BookingRepository,
  ) {}

  public async create(body: CreateDeskInput) {
    await this.verifyNumberDesk(body.number);

    const desk = await this.deskRepo.create(body);

    return desk;
  }

  public async updateById(id: string, body: UpdateDeskInput) {
    await this.verifyNumberDesk(body.number);

    const desk = await this.deskRepo.updateById(id, body);

    if (!desk) {
      throw new NotFoundException('Desk not found');
    }

    return desk;
  }

  @Transactional()
  public async deleteById(id: string, session?: ClientSession) {
    const desk = await this.deskRepo.deleteById(id, session);

    if (!desk) {
      throw new NotFoundException('Desk not found');
    }

    await this.bookingRepo.deleteManyByIds(desk.bookings, session);

    return desk;
  }

  public async deleteAll() {
    const desk = await this.deskRepo.deleteAll();

    return desk;
  }

  public async getTimeFreeSlots(deskId: string, date: Date) {
    const desk = await this.deskRepo.findById(deskId);

    if (!desk) {
      throw new NotFoundException('Desk not found');
    }

    const { startOfDay, endOfDay } = getStartAndEndOfDay(date);
    const bookings = await this.bookingRepo.findByDeskAndPeriod(deskId, startOfDay, endOfDay);

    if (!bookings.length) {
      throw new NotFoundException('No available slots for the selected date and desk');
    }

    const slots = generateTimeSlots({
      intervalMinutes: this.bookingConfig.internalMinutes,
      busySlots: bookings.map((booking) => ({
        startDate: booking.startDate,
        endDate: booking.endDate,
      })),
      periodStart: dayjs.utc(startOfDay).set('hour', this.bookingConfig.periodStart).set('minute', 0).toDate(),
      periodEnd: dayjs.utc(endOfDay).set('hour', this.bookingConfig.periodEnd).set('minute', 0).toDate(),
    });

    return slots;
  }

  public async verifyNumberDesk(number?: number) {
    if (!number) return null;

    const desk = await this.deskRepo.findByNumber(number);

    if (desk) {
      throw new ConflictException('Desk with this number already exists');
    }
  }
}
