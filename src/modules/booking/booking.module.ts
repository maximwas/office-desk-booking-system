import { Module } from '@nestjs/common';

import { BookingController } from './booking.controller';
import { BookingServiceModule } from './service/booking-service.module';

@Module({
  imports: [BookingServiceModule],
  controllers: [BookingController],
})
export class BookingModule {}
