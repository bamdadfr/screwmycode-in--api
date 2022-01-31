import { Controller, Get } from '@nestjs/common';
import sortBy from 'just-sort-by';
import { RootLatestDto, RootTopDto } from './dto/root.dto.js';
import { RootService } from './root.service.js';

@Controller()
export class RootController {
  constructor(private readonly rootService: RootService) {}

  @Get('top')
  async findTop(): Promise<RootTopDto> {
    const limit = 10;
    const results = await this.rootService.readAllByHits(limit);
    return sortBy(results, 'hits').reverse().slice(0, limit);
  }

  @Get('latest')
  async findLatest(): Promise<RootLatestDto> {
    const limit = 10;
    const results = await this.rootService.readAllByDate(limit);
    return sortBy(results, 'updatedAt').reverse().slice(0, limit);
  }
}
