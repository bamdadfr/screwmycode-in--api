import { Controller, Get, Param } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { ReadYoutubeDto } from './dto/read-youtube.dto';
import { ReadYoutubesDto } from './dto/read-youtubes.dto';
import { buildResponseFromEntity, buildResponseFromError } from './utils';

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
    try {
      const result = await this.youtubeService.find(id);
      return buildResponseFromEntity(result);
    } catch (error) {
      return buildResponseFromError(error);
    }
  }
}
