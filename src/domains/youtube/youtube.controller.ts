import { Controller, Get, Param, Res, Response } from '@nestjs/common';
import got from 'got';
import { YoutubeService } from './youtube.service.js';
import { YoutubeDto } from './dto/youtube.dto.js';
import { validateYoutubeId } from './utils/validate-youtube-id.js';
import { getPipedYoutubeMedia } from './utils/get-piped-youtube-media.js';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get(':id')
  async find(@Param('id') id: string): Promise<YoutubeDto> {
    validateYoutubeId(id);

    const youtube = await this.youtubeService.readOrCreate(id);
    return {
      id: youtube.id,
      hits: youtube.hits,
      title: youtube.title,
      image: getPipedYoutubeMedia(youtube, 'image'),
      audio: getPipedYoutubeMedia(youtube, 'audio'),
    };
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
      await this.youtubeService.increment(id);
      got.stream(audio).pipe(res as any);
    }
  }
}
