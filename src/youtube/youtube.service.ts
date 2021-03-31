import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateYoutubeDto } from './dto/create-youtube.dto';
import { Youtube, YoutubeDocument } from './schemas/youtube.schema';
import { youtubeIdIsvalid } from './utils/youtube-id-is-valid';
import { GetYoutubeInfo, getYoutubeInfo } from './utils/get-youtube-info';
import { getExpireDate } from './utils/get-expire-date';

@Injectable()
export class YoutubeService {
  constructor(
    @InjectModel(Youtube.name)
    private readonly youtubeModel: Model<YoutubeDocument>,
  ) {}

  // this method will be used in future versions to retrieve all entries with pagination
  async index(): Promise<Record<string, never>> {
    // return this.youtubeModel.find().select('-_id id title url hit');
    return {};
  }

  async read(id: string): Promise<Youtube> {
    if (!youtubeIdIsvalid(id)) throw new Error('youtube id is not valid');

    const now = parseInt(Date.now().toString().slice(0, 10), 10);
    const exists = await this.youtubeModel.exists({ id });

    // if entry exists and not expired, return it
    if (exists) {
      const foundYoutube = await this.youtubeModel.findOne({ id });
      if (now < foundYoutube.expireDate) {
        return foundYoutube;
      } else {
        return await this.readThenRefresh(id);
      }
    }

    // document does not exist, create it
    return await this.readThenCreate(id);
  }

  async readThenCreate(id: string): Promise<Youtube> {
    if (!youtubeIdIsvalid(id)) throw new Error('youtube id is not valid');

    let youtube: GetYoutubeInfo;
    try {
      youtube = await getYoutubeInfo(id);
    } catch (error) {
      throw new Error(error);
    }

    const createYoutubeDto: CreateYoutubeDto = {
      id,
      title: youtube.title,
      url: youtube.url,
      hit: 1,
      expireDate: getExpireDate(youtube.url, youtube.isDash),
    };

    const createdYoutube = new this.youtubeModel(createYoutubeDto);
    return await createdYoutube.save();
  }

  async readThenRefresh(id: string): Promise<Youtube> {
    if (!youtubeIdIsvalid(id)) throw new Error('youtube id is not valid');

    const foundYoutube = await this.youtubeModel.findOne({ id });

    let youtube: GetYoutubeInfo;
    try {
      youtube = await getYoutubeInfo(id);
    } catch (error) {
      throw new Error(error);
    }

    foundYoutube.title = youtube.title;
    foundYoutube.url = youtube.url;
    foundYoutube.expireDate = getExpireDate(youtube.url, youtube.isDash);
    foundYoutube.hit += 1;

    return foundYoutube.save();
  }

  async update(id: string): Promise<Youtube> {
    if (!youtubeIdIsvalid(id)) throw new Error('youtube id is not valid');

    const foundYoutube = await this.youtubeModel.findOne({ id });

    if (foundYoutube === null) throw new Error('youtube id was not found');

    foundYoutube.hit += 1;

    return foundYoutube.save();
  }
}
