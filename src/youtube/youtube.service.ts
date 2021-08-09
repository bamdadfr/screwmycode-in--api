import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { YoutubeEntity, YoutubeDocument } from './youtube.schema';
import { GetYoutubeInfo, getYoutubeInfo } from './utils/get-youtube-info';
import { getExpirationDate } from './utils/get-expiration-date';
import axios from 'axios';

@Injectable()
export class YoutubeService {
  constructor(
    @InjectModel(YoutubeEntity.name)
    private readonly youtubeModel: Model<YoutubeDocument>,
  ) {}

  /**
   * @description get the 5 most played entries
   */
  async findAll(): Promise<YoutubeEntity[]> {
    return this.youtubeModel
      .find()
      .select('-_id id title hits')
      .sort({ hits: -1 })
      .limit(5);
  }

  /**
   * @description find a youtubeDocument by id
   */
  async find(id: string): Promise<YoutubeEntity> {
    const dateNow = parseInt(Date.now().toString().slice(0, 10), 10);
    const youtubeDocumentExists = await this.youtubeModel.exists({ id });

    // if document does not exist, create document
    if (!youtubeDocumentExists) return await this.create(id);

    // fetch existing document
    const youtubeDocument = await this.youtubeModel.findOne({ id });
    let isAccessible;
    try {
      isAccessible = (await axios.head(youtubeDocument.url)).status === 200;
    } catch (error) {}

    console.log(isAccessible);

    // if isAccessible and date not expired, return existing document
    if (isAccessible && dateNow < youtubeDocument.expireDate)
      return youtubeDocument;

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
