import { Controller, Get, Param, Res, Response } from '@nestjs/common';
import ytdl from 'ytdl-core';
import got from 'got';
import { YoutubeService } from './youtube.service.js';
import { ReadYoutubeDto } from './dto/read-youtube.dto.js';
import { ReadYoutubesDto } from './dto/read-youtubes.dto.js';
import { buildResponseFromEntity } from './utils/build-response-from-entity.js';
import { buildResponseFromError } from './utils/build-response-from-error.js';
import { buildResponseFromEntities } from './utils/build-response-from-entities.js';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get()
  async findAll(): Promise<ReadYoutubesDto> {
    const result = await this.youtubeService.findAll();
    return buildResponseFromEntities(result);
  }

  @Get('/latest')
  async findLatest(): Promise<any> {
    const result = await this.youtubeService.findLatest();
    return buildResponseFromEntities(result);
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<ReadYoutubeDto> {
    const isValid = ytdl.validateID(id);
    if (!isValid) {
      return buildResponseFromError(new Error('id is not valid'));
    }

    const result = await this.youtubeService.find(id);
    return buildResponseFromEntity(result);
  }

  @Get(':id/image')
  async getImage(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const { image } = await this.youtubeService.find(id);
    if (image) {
      got.stream(image).pipe(res as any);
    }
  }

  @Get(':id/audio')
  async getAudio(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const { url } = await this.youtubeService.find(id);
    if (url) {
      got.stream(url).pipe(res as any);
    }
  }
}
