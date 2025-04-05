import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DeskController } from './desk.controller';
import { DeskService } from './desk.service';
import { Desk, DeskSchema } from './schema/desk.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Desk.name,
        schema: DeskSchema,
      },
    ]),
  ],
  controllers: [DeskController],
  providers: [DeskService],
})
export class DeskModule {}
