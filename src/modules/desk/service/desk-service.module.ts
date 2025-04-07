import { Module } from '@nestjs/common';
import { BookingConfigProvider } from 'src/core/config/booking.config';
import { BookingRepositoryModule } from 'src/modules/booking/repository/booking-repository.module';

import { DeskRepositoryModule } from '../repository/desk-repository.module';
import { DeskService } from './desk.service';

@Module({
  imports: [DeskRepositoryModule, BookingRepositoryModule],
  providers: [DeskService, BookingConfigProvider],
  exports: [DeskService],
})
export class DeskServiceModule {}
