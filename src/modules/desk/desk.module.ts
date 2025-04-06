import { Module } from '@nestjs/common';

import { DeskController } from './desk.controller';
import { DeskServiceModule } from './service/desk-service.module';

@Module({
  imports: [DeskServiceModule],
  controllers: [DeskController],
})
export class DeskModule {}
