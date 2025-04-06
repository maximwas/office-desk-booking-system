import { Module } from '@nestjs/common';
import { BookingRepositoryModule } from 'src/modules/booking/repository/booking-repository.module';

import { DeskRepositoryModule } from '../repository/desk-repository.module';
import { DeskService } from './desk.service';

@Module({
  imports: [DeskRepositoryModule, BookingRepositoryModule],
  providers: [DeskService],
  exports: [DeskService],
})
export class DeskServiceModule {}
