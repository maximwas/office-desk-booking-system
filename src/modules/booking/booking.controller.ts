import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { BookingService } from './service/booking.service';
import { CreateBookingInput, UpdateBookingInput } from './types/booking.dto';

@Controller({
  path: 'booking',
  version: '1',
})
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: CreateBookingInput) {
    return this.bookingService.create(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateById(@Param() id: string, @Body() body: UpdateBookingInput) {
    return this.bookingService.updateById(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param() id: string) {
    return this.bookingService.deleteById(id);
  }
}
