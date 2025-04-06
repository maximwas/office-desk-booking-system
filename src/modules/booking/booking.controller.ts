import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { BookingService } from './service/booking.service';
import { CreateBookingInput } from './types/booking.dto';

@Controller({
  path: 'booking',
  version: '1',
})
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createBooking(@Body() body: CreateBookingInput) {
    return this.bookingService.create(body);
  }
}
