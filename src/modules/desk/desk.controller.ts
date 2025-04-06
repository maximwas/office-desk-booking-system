import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

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
  createDesk(@Body() body: CreateDeskInput) {
    return this.deskService.create(body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteDesk(@Param('id') id: string) {
    return this.deskService.delete(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateDesk(@Param('id') id: string, @Body() body: UpdateDeskInput) {
    return this.deskService.update(id, body);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteDeskAll() {
    return this.deskService.deleteAll();
  }

  @Get('/time-slots')
  @UseGuards(JwtAuthGuard)
  getTimeFreeSlots(@Query('id') id: string, @Query('date') date: Date) {
    return this.deskService.getTimeFreeSlots(id, date);
  }
}
