import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Youtube, YoutubeDocument } from '../youtube/schemas/youtube.schema.js';
import {
  Soundcloud,
  SoundcloudDocument,
} from '../soundcloud/schemas/soundcloud.schema.js';
import {
  RootLatestDto,
  RootSoundcloudLatest,
  RootSoundcloudTop,
  RootTopDto,
  RootYoutubeLatest,
  RootYoutubeTop,
} from './dto/root.dto.js';
import { getDomain } from '../../utils/get-domain.js';

export class RootService {
  constructor(
    @InjectModel(Youtube.name)
    private readonly youtubeModel: mongoose.Model<YoutubeDocument>,
    @InjectModel(Soundcloud.name)
    private readonly soundcloudModel: mongoose.Model<SoundcloudDocument>,
  ) {}

  async readAllByHits(limit = 10): Promise<RootTopDto> {
    const youtubes = await this.youtubeModel
      .find()
      .select('-_id id hits title image')
      .sort({ hits: -1 })
      .limit(limit);

    const soundclouds = await this.soundcloudModel
      .find()
      .select('-_id id hits title image')
      .sort({ hits: -1 })
      .limit(limit);

    const typedYoutubes: RootYoutubeTop[] = youtubes.map((youtube) => {
      return {
        ...youtube.toObject(),
        image: `${getDomain()}/youtube/${youtube.id}/image`,
        type: 'youtube',
      };
    });

    const typedSoundclouds: RootSoundcloudTop[] = soundclouds.map(
      (soundcloud) => {
        return {
          ...soundcloud.toObject(),
          image: `${getDomain()}/soundcloud/${soundcloud.id}/image`,
          type: 'soundcloud',
        };
      },
    );

    return [...typedYoutubes, ...typedSoundclouds];
  }

  async readAllByDate(limit = 10): Promise<RootLatestDto> {
    const youtubes = await this.youtubeModel
      .find()
      .select('-_id id hits title image updatedAt')
      .sort({ updatedAt: -1 })
      .limit(limit);

    const soundclouds = await this.soundcloudModel
      .find()
      .select('-_id id hits title image updatedAt')
      .sort({ updatedAt: -1 })
      .limit(limit);

    const typedYoutubes: RootYoutubeLatest[] = youtubes.map((youtube) => {
      return {
        ...youtube.toObject(),
        image: `${getDomain()}/youtube/${youtube.id}/image`,
        type: 'youtube',
      };
    });

    const typedSoundclouds: RootSoundcloudLatest[] = soundclouds.map(
      (soundcloud) => {
        return {
          ...soundcloud.toObject(),
          image: `${getDomain()}/soundcloud/${soundcloud.id}/image`,
          type: 'soundcloud',
        };
      },
    );

    return [...typedYoutubes, ...typedSoundclouds];
  }
}
