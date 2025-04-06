import { Module } from '@nestjs/common';
import { DeskRepositoryModule } from 'src/modules/desk/repository/desk-repository.module';

import { BookingRepositoryModule } from '../repository/booking-repository.module';
import { BookingService } from './booking.service';

@Module({
  imports: [BookingRepositoryModule, DeskRepositoryModule],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingServiceModule {}
