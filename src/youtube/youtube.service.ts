import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import got from 'got';
import { YoutubeDocument, YoutubeEntity } from './youtube.schema.js';
import { GetYoutubeInfo, getYoutubeInfo } from './utils/get-youtube-info.js';
import { getExpirationDate } from './utils/get-expiration-date.js';

@Injectable()
export class YoutubeService {
  constructor(
    @InjectModel(YoutubeEntity.name)
    private readonly youtubeModel: mongoose.Model<YoutubeDocument>,
  ) {}

  async readAllByHits(limit = 5): Promise<YoutubeEntity[]> {
    return this.youtubeModel
      .find()
      .select('-_id id title image hits')
      .sort({ hits: -1 })
      .limit(limit);
  }

  async readAllByDate(limit = 10): Promise<YoutubeEntity[]> {
    return this.youtubeModel
      .find()
      .select('-_id id title image hits')
      .sort({ expireDate: -1 })
      .limit(limit);
  }

  async read(id: string): Promise<YoutubeEntity> {
    return this.youtubeModel.findOne({ id });
  }

  async create(id: string): Promise<YoutubeEntity> {
    let info: GetYoutubeInfo;
    try {
      info = await getYoutubeInfo(id);
    } catch (error) {
      throw new Error(error);
    }

    const modelPrimitives: YoutubeEntity = {
      id,
      title: info.title,
      image: info.image,
      url: info.url,
      hits: 1,
      expireDate: getExpirationDate(info.url, info.isDash),
    };

    const document = new this.youtubeModel(modelPrimitives);
    return await document.save();
  }

  async update(id: string): Promise<YoutubeEntity> {
    const document = await this.youtubeModel.findOne({ id });

    let info: GetYoutubeInfo;
    try {
      info = await getYoutubeInfo(id);
    } catch (error) {
      throw new Error(error);
    }

    document.title = info.title;
    document.image = info.image;
    document.url = info.url;
    document.expireDate = getExpirationDate(info.url, info.isDash);
    document.hits += 1;

    return document.save();
  }

  async readOrCreate(id: string): Promise<YoutubeEntity> {
    const documentExists = await this.youtubeModel.exists({ id });

    if (documentExists) {
      return this.read(id);
    } else {
      return await this.create(id);
    }
  }

  async readAndEnsureAudioAvailable(id: string): Promise<YoutubeEntity> {
    const document = await this.read(id);

    let isAvailable;
    try {
      const { statusCode } = await got.head(document.url);
      isAvailable = statusCode === 200;
    } catch (error) {}

    const dateNow = parseInt(Date.now().toString().slice(0, 10), 10);
    if (isAvailable && dateNow < document.expireDate) {
      return document;
    }

    return await this.update(id);
  }
}
