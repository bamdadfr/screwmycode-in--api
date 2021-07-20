import { Controller, Get, Param } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { ReadYoutubeDto } from './dto/read-youtube.dto';
import { ReadYoutubesDto } from './dto/read-youtubes.dto';
import { buildResponseFromEntity } from './utils/build-response-from-entity';
import { buildResponseFromError } from './utils/build-response-from-error';
import * as ytdl from 'ytdl-core';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get()
  async findAll(): Promise<ReadYoutubesDto> {
    return {
      success: true,
    };
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<ReadYoutubeDto> {
    const isValid = ytdl.validateID(id);
    if (!isValid) return buildResponseFromError(new Error('id is not valid'));

    const result = await this.youtubeService.find(id);
    return buildResponseFromEntity(result);
  }
}
