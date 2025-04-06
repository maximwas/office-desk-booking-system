import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface BookingConfig {
  maxPeriod: number;
  internalMinutes: number;
  periodStart: number;
  periodEnd: number;
}

export const BOOKING_CONFIG = 'BOOKING_CONFIG';

export const BookingConfigProvider: Provider = {
  provide: BOOKING_CONFIG,
  useFactory: (configService: ConfigService): BookingConfig => ({
    maxPeriod: parseInt(configService.getOrThrow<string>('BOOKING_MAX_PERIOD'), 10),
    internalMinutes: parseInt(configService.getOrThrow<string>('BOOKING_INTERVAL_MINUTES'), 10),
    periodStart: parseInt(configService.getOrThrow<string>('BOOKING_PERIOD_START'), 10),
    periodEnd: parseInt(configService.getOrThrow<string>('BOOKING_PERIOD_END'), 10),
  }),
  inject: [ConfigService],
};
