import { Controller, Get, Param, Post } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { YoutubeDto } from './youtube.dto';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get()
  async index(): Promise<{ success: boolean }> {
    return {
      success: true,
    };
  }

  @Get(':id')
  async read(@Param('id') id: string): Promise<YoutubeDto> {
    try {
      const { title, url, hits } = await this.youtubeService.read(id);
      return {
        success: true,
        data: {
          title,
          url,
          hits,
        },
      };
    } catch (error) {
      const { message } = error;
      return {
        success: false,
        error: {
          message,
        },
      };
    }
  }

  @Post(':id')
  async update(@Param('id') id: string): Promise<YoutubeDto> {
    try {
      await this.youtubeService.update(id);
      const { title, url, hits } = await this.youtubeService.read(id);
      return {
        success: true,
        data: {
          title,
          url,
          hits,
        },
      };
    } catch (error) {
      const { message } = error;
      return {
        success: false,
        error: {
          message,
        },
      };
    }
  }
}
