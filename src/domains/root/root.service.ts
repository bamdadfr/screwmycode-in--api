import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Youtube, YoutubeDocument } from '../youtube/schemas/youtube.schema.js';
import {
  Soundcloud,
  SoundcloudDocument,
} from '../soundcloud/schemas/soundcloud.schema.js';

export class RootService {
  constructor(
    @InjectModel(Youtube.name)
    private readonly youtubeModel: mongoose.Model<YoutubeDocument>,
    @InjectModel(Soundcloud.name)
    private readonly soundcloudModel: mongoose.Model<SoundcloudDocument>,
  ) {}

  async readAllByHits(limit = 10): Promise<{
    youtubes: YoutubeDocument[];
    soundclouds: SoundcloudDocument[];
  }> {
    const fields = '-_id id hits title image';

    const youtubes = await this.youtubeModel
      .find()
      .select(fields)
      .sort({ hits: -1 })
      .limit(limit);

    const soundclouds = await this.soundcloudModel
      .find()
      .select(fields)
      .sort({ hits: -1 })
      .limit(limit);

    return {
      youtubes,
      soundclouds,
    };
  }

  async readAllByDate(limit = 10): Promise<{
    youtubes: YoutubeDocument[];
    soundclouds: SoundcloudDocument[];
  }> {
    const fields = '-_id id hits title image updatedAt';

    const youtubes = await this.youtubeModel
      .find()
      .select(fields)
      .sort({ updatedAt: -1 })
      .limit(limit);

    const soundclouds = await this.soundcloudModel
      .find()
      .select(fields)
      .sort({ updatedAt: -1 })
      .limit(limit);

    return {
      youtubes,
      soundclouds,
    };
  }
}
