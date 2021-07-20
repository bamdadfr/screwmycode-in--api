import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ReadAppDto } from './dto/read-app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  index(): ReadAppDto {
    return this.appService.index();
  }
}
