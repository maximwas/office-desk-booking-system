import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { DeskService } from './service/desk.service';
import { CreateDeskInput, UpdateDeskInput } from './types/desk.dto';

@Controller({
  path: 'desk',
  version: '1',
})
export class DeskController {
  constructor(private readonly deskService: DeskService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: CreateDeskInput) {
    return this.deskService.create(body);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id: string) {
    return this.deskService.deleteById(id);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  updateById(@Param('id') id: string, @Body() body: UpdateDeskInput) {
    return this.deskService.updateById(id, body);
  }

  @Get('/:id/time-slots/:date')
  @UseGuards(JwtAuthGuard)
  getTimeFreeSlots(@Param('id') id: string, @Param('date') date: Date) {
    return this.deskService.getTimeFreeSlots(id, date);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteAll() {
    return this.deskService.deleteAll();
  }
}
