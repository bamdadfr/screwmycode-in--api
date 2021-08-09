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
   * this method will be used in future versions to retrieve all entries with pagination
   */
  // async findAll(): Promise<void> {
  // return this.youtubeModel.find().select('-_id id title url hit');
  // }

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
    const isAccessible = (await axios.head(youtubeDocument.url)).status === 200;

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
