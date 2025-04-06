import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Booking, BookingSchema } from '../schema/booking.schema';
import { BookingRepository } from './booking.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }])],
  providers: [BookingRepository],
  exports: [BookingRepository],
})
export class BookingRepositoryModule {}
