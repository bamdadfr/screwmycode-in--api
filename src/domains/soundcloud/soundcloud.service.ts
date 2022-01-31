import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import SoundcloudScraper from 'soundcloud-scraper';
import { Soundcloud, SoundcloudDocument } from './schemas/soundcloud.schema.js';
import { getSoundcloudUrl } from './utils/get-soundcloud-url.js';
import { getSoundcloudStream } from './utils/get-soundcloud-stream.js';
import { isUrlAccessible } from '../../utils/is-url-accessible.js';

@Injectable()
export class SoundcloudService {
  constructor(
    @InjectModel(Soundcloud.name)
    private readonly soundcloudModel: mongoose.Model<SoundcloudDocument>,
  ) {}

  async readOrCreate(id: Soundcloud['id']): Promise<Soundcloud> {
    const documentExists = await this.soundcloudModel.exists({ id });

    if (documentExists) {
      return await this.read(id);
    } else {
      return await this.create(id);
    }
  }

  async read(id: Soundcloud['id']): Promise<Soundcloud> {
    return this.soundcloudModel.findOne({ id });
  }

  async increment(id: Soundcloud['id']): Promise<Soundcloud> {
    return this.soundcloudModel.findOneAndUpdate({ id }, { $inc: { hits: 1 } });
  }

  async create(id: Soundcloud['id']): Promise<Soundcloud> {
    const url = getSoundcloudUrl(id);
    const scraper = new SoundcloudScraper.Client();
    const info = await scraper.getSongInfo(url);
    const stream = await getSoundcloudStream(info.trackURL);

    const draft: Soundcloud = {
      id,
      hits: 0,
      title: info.title,
      image: info.thumbnail,
      audio: info.trackURL,
      stream,
    };

    const document = new this.soundcloudModel(draft);
    return document.save();
  }

  async update(id: Soundcloud['id']): Promise<Soundcloud> {
    const soundcloud = await this.soundcloudModel.findOne({ id });
    soundcloud.stream = await getSoundcloudStream(soundcloud.audio);
    return soundcloud.save();
  }

  async readAndEnsureStreamAvailable(
    id: Soundcloud['id'],
  ): Promise<Soundcloud> {
    const soundcloud = await this.read(id);
    const isAccessible = await isUrlAccessible(soundcloud.stream);

    if (!isAccessible) {
      return this.update(id);
    }

    return soundcloud;
  }
}
