import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { YoutubeDocument, Youtube } from '../youtube/schemas/youtube.schema.js';
import {
  Soundcloud,
  SoundcloudDocument,
} from '../soundcloud/schemas/soundcloud.schema.js';
import { TypedEntity } from '../../utils/append-type.js';
import { mergeDocuments } from './utils/merge-documents.js';

export class RootService {
  constructor(
    @InjectModel(Youtube.name)
    private readonly youtubeModel: mongoose.Model<YoutubeDocument>,
    @InjectModel(Soundcloud.name)
    private readonly soundcloudModel: mongoose.Model<SoundcloudDocument>,
  ) {}

  async readAllByHits(limit = 10): Promise<TypedEntity[]> {
    const soundcloudDocuments = await this.soundcloudModel
      .find()
      .select('-_id id hits title image')
      .sort({ hits: -1 })
      .limit(limit);

    const youtubeDocuments = await this.youtubeModel
      .find()
      .select('-_id id hits title image')
      .sort({ hits: -1 })
      .limit(limit);

    return mergeDocuments({ soundcloudDocuments, youtubeDocuments });
  }

  async readAllByDate(limit = 10): Promise<TypedEntity[]> {
    const soundcloudDocuments = await this.soundcloudModel
      .find()
      .select('-_id id hits title image updatedAt')
      .sort({ updatedAt: -1 })
      .limit(limit);

    const youtubeDocuments = await this.youtubeModel
      .find()
      .select('-_id id hits title image updatedAt')
      .sort({ updatedAt: -1 })
      .limit(limit);

    return mergeDocuments({ soundcloudDocuments, youtubeDocuments });
  }
}
