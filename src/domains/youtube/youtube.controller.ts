import { Controller, Get, Param, Res, Response } from '@nestjs/common';
import got from 'got';
import { YoutubeService } from './youtube.service.js';
import { YoutubeDto } from './dto/youtube.dto.js';
import { validateYoutubeId } from './utils/validate-youtube-id.js';
import { generateYoutubeDto } from './utils/generate-youtube-dto.js';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get(':id')
  async find(@Param('id') id: string): Promise<YoutubeDto> {
    validateYoutubeId(id);
    const document = await this.youtubeService.readOrCreate(id);
    return generateYoutubeDto(document);
  }

  @Get(':id/image')
  async getImage(@Param('id') id: string, @Res() res: Response): Promise<void> {
    validateYoutubeId(id);
    const { image } = await this.youtubeService.read(id);
    if (image) {
      got.stream(image).pipe(res as any);
    }
  }

  @Get(':id/audio')
  async getAudio(@Param('id') id: string, @Res() res: Response): Promise<void> {
    validateYoutubeId(id);
    const { audio } = await this.youtubeService.readAndEnsureAudioAvailable(id);
    if (audio) {
      got.stream(audio).pipe(res as any);
    }
  }
}
