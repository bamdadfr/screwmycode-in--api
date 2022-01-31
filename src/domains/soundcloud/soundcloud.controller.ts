import { Controller, Get, Param, Res, Response } from '@nestjs/common';
import got from 'got';
import { SoundcloudService } from './soundcloud.service.js';
import { validateSoundcloudUrl } from './utils/validate-soundcloud-url.js';
import { SoundcloudDto } from './dto/soundcloud.dto.js';
import { getSoundcloudUrl } from './utils/get-soundcloud-url.js';
import { getPipedSoundcloudMedia } from './utils/get-piped-soundcloud-media.js';

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

    return {
      id: soundcloud.id,
      hits: soundcloud.hits,
      title: soundcloud.title,
      image: getPipedSoundcloudMedia(soundcloud, 'image'),
      audio: getPipedSoundcloudMedia(soundcloud, 'audio'),
    };
  }

  @Get(':username/:trackName/image')
  async getImage(
    @Param('username') username: string,
    @Param('trackName') trackName: string,
    @Res() res: Response,
  ): Promise<void> {
    const id = `${username}/${trackName}`;
    const url = getSoundcloudUrl(id);
    await validateSoundcloudUrl(url);

    const { image } = await this.soundcloudService.read(id);

    if (image) {
      got.stream(image).pipe(res as any);
    }
  }

  @Get(':username/:trackName/audio')
  async getAudio(
    @Param('username') username: string,
    @Param('trackName') trackName: string,
    @Res() res,
  ): Promise<void> {
    const id = `${username}/${trackName}`;
    const url = getSoundcloudUrl(id);
    await validateSoundcloudUrl(url);

    const { stream } =
      await this.soundcloudService.readAndEnsureStreamAvailable(id);

    if (stream) {
      await this.soundcloudService.increment(id);
      res.set({ 'Cross-Origin-Resource-Policy': 'same-site' });
      got.stream(stream).pipe(res);
    }
  }
}
