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

  /**
   * @description get the 5 most played entries
   */
  async findAll(): Promise<YoutubeEntity[]> {
    return this.youtubeModel
      .find()
      .select('-_id id title image hits')
      .sort({ hits: -1 })
      .limit(5);
  }

  /**
   * Find the last 10 entries
   */
  async findLatest(): Promise<YoutubeEntity[]> {
    return this.youtubeModel
      .find()
      .select('-_id id title image hits')
      .sort({ expireDate: -1 })
      .limit(10);
  }

  /**
   * @description find a youtubeDocument by id
   */
  async find(id: string): Promise<YoutubeEntity> {
    const dateNow = parseInt(Date.now().toString().slice(0, 10), 10);
    const youtubeDocumentExists = await this.youtubeModel.exists({ id });

    // if document does not exist, create document
    if (!youtubeDocumentExists) {
      return await this.create(id);
    }

    // fetch existing document
    const youtubeDocument = await this.youtubeModel.findOne({ id });
    let isAccessible;
    try {
      const { statusCode } = await got.head(youtubeDocument.url);
      isAccessible = statusCode === 200;
    } catch (error) {}

    // if isAccessible and date not expired, return existing document
    if (isAccessible && dateNow < youtubeDocument.expireDate) {
      return youtubeDocument;
    }

    // else, update existing document
    return await this.update(id);
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

  /**
   * @description update document
   */
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
}
