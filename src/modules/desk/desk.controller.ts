import { Controller } from '@nestjs/common';

import { DeskService } from './desk.service';

@Controller('desk')
export class DeskController {
  constructor(private readonly deskService: DeskService) {}
}
