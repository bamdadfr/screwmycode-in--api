import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { AppDto } from './dto/app.dto.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  index(): AppDto {
    return this.appService.index();
  }
}
