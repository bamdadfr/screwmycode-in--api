import { Controller, Get, Param, Res, Response } from '@nestjs/common';
import got from 'got';
import { YoutubeService } from './youtube.service.js';
import { ReadYoutubeDto } from './dto/read-youtube.dto.js';
import { buildResponseFromEntity } from './utils/build-response-from-entity.js';
import { buildResponseFromEntities } from './utils/build-response-from-entities.js';
import { validateYoutubeId } from './utils/validate-youtube-id.js';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get()
  async findTop(): Promise<ReadYoutubeDto[]> {
    const results = await this.youtubeService.readAllByHits();
    return buildResponseFromEntities(results);
  }

  @Get('/latest')
  async findLatest(): Promise<any> {
    const results = await this.youtubeService.readAllByDate();
    return buildResponseFromEntities(results);
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<ReadYoutubeDto> {
    validateYoutubeId(id);
    const result = await this.youtubeService.readOrCreate(id);
    return buildResponseFromEntity(result);
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
    const { url } = await this.youtubeService.readAndEnsureAudioAvailable(id);
    if (url) {
      got.stream(url).pipe(res as any);
    }
  }
}
