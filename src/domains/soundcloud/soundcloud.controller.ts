import { Controller, Get, Param } from '@nestjs/common';
import { SoundcloudService } from './soundcloud.service.js';
import { validateSoundcloudUrl } from './utils/validate-soundcloud-url.js';
import { getSoundcloudStream } from './utils/get-soundcloud-stream.js';
import { SoundcloudDto } from './dto/soundcloud.dto.js';
import { getSoundcloudUrl } from './utils/get-soundcloud-url.js';

@Controller('soundcloud')
export class SoundcloudController {
  constructor(private readonly soundcloudService: SoundcloudService) {}

  @Get(':username/:trackName')
  async getTrack(
    @Param('username') username: string,
    @Param('trackName') trackName: string,
  ): Promise<SoundcloudDto> {
    const id = `${username}/${trackName}`;
    const url = getSoundcloudUrl(id);
    await validateSoundcloudUrl(url);

    const soundcloud = await this.soundcloudService.readOrCreate(id);
    const stream = await getSoundcloudStream(soundcloud);
    await this.soundcloudService.increment(id);

    return {
      id: soundcloud.id,
      hits: soundcloud.hits,
      title: soundcloud.title,
      image: soundcloud.image,
      audio: stream,
    };
  }
}
