import { Controller, Get } from '@nestjs/common';
import sortBy from 'just-sort-by';
import { RootLatestDto, RootTopDto } from './dto/root.dto.js';
import { RootService } from './root.service.js';
import { convertDocumentsToResponseObjects } from './utils/convert-documents-to-response-objects.js';

@Controller()
export class RootController {
  private readonly limit = 10;

  constructor(private readonly rootService: RootService) {}

  @Get('top')
  async findTop(): Promise<RootTopDto[]> {
    const results = await this.rootService.readAllByHits(this.limit);

    const youtubes = convertDocumentsToResponseObjects(
      results.youtubes,
      'youtube',
    );

    const soundclouds = convertDocumentsToResponseObjects(
      results.soundclouds,
      'soundcloud',
    );

    return sortBy([...youtubes, ...soundclouds], 'hits')
      .reverse()
      .slice(0, this.limit);
  }

  @Get('latest')
  async findLatest(): Promise<RootLatestDto[]> {
    const results = await this.rootService.readAllByDate(this.limit);

    const youtubes = convertDocumentsToResponseObjects(
      results.youtubes,
      'youtube',
    );

    const soundclouds = convertDocumentsToResponseObjects(
      results.soundclouds,
      'soundcloud',
    );

    return sortBy([...youtubes, ...soundclouds], 'updatedAt')
      .reverse()
      .slice(0, this.limit);
  }
}
