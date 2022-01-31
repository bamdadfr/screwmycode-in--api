import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { YoutubeDocument, Youtube } from './schemas/youtube.schema.js';
import { GetYoutubeInfo, getYoutubeInfo } from './utils/get-youtube-info.js';
import { getExpirationDate } from './utils/get-expiration-date.js';
import { getNowDate } from './utils/get-now-date.js';
import { isUrlAccessible } from '../../utils/is-url-accessible.js';

@Injectable()
export class YoutubeService {
  constructor(
    @InjectModel(Youtube.name)
    private readonly youtubeModel: mongoose.Model<YoutubeDocument>,
  ) {}

  async read(id: Youtube['id']): Promise<Youtube> {
    return this.youtubeModel.findOne({ id });
  }

  async increment(id: Youtube['id']): Promise<Youtube> {
    return this.youtubeModel.findOneAndUpdate({ id }, { $inc: { hits: 1 } });
  }

  async create(id: string): Promise<Youtube> {
    let info: GetYoutubeInfo;
    try {
      info = await getYoutubeInfo(id);
    } catch (error) {
      throw new Error(error);
    }

    const draft: Youtube = {
      id,
      title: info.title,
      image: info.image,
      audio: info.url,
      hits: 0,
    };

    const document = new this.youtubeModel(draft);
    return await document.save();
  }

  async update(id: Youtube['id']): Promise<Youtube> {
    const document = await this.youtubeModel.findOne({ id });

    let info: GetYoutubeInfo;
    try {
      info = await getYoutubeInfo(id);
    } catch (error) {
      throw new Error(error);
    }

    document.title = info.title;
    document.image = info.image;
    document.audio = info.url;
    document.hits += 1;

    return document.save();
  }

  async readOrCreate(id: Youtube['id']): Promise<Youtube> {
    const documentExists = await this.youtubeModel.exists({ id });

    if (documentExists) {
      return this.read(id);
    } else {
      return await this.create(id);
    }
  }

  async readAndEnsureAudioAvailable(id: Youtube['id']): Promise<Youtube> {
    const document = await this.read(id);
    const isAccessible = await isUrlAccessible(document.audio);
    const expireDate = getExpirationDate(document.audio);
    const nowDate = getNowDate();

    if (isAccessible && nowDate < expireDate) {
      return document;
    }

    return await this.update(id);
  }
}
