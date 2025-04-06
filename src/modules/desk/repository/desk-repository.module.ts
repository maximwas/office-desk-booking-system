import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Desk, DeskSchema } from '../schema/desk.schema';
import { DeskRepository } from './desk.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Desk.name, schema: DeskSchema }])],
  providers: [DeskRepository],
  exports: [DeskRepository],
})
export class DeskRepositoryModule {}
