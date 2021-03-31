import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AppDto } from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  index(): AppDto {
    return this.appService.index();
  }
}
