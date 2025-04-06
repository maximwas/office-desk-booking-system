import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingModule } from 'src/modules/booking/booking.module';
import { DeskModule } from 'src/modules/desk/desk.module';

import { AuthModule } from '../modules/auth/auth.module';
import { UserModule } from '../modules/user/user.module';
import { getConfigMongo } from './config/mongo.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getConfigMongo,
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    DeskModule,
    BookingModule,
  ],
})
export class CoreModule {}
