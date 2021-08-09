import * as ytdl from 'ytdl-core';
import { getDashUrl } from './get-dash-url';

export class GetYoutubeInfo {
  title?: string;
  image?: string;
  url?: string;
  isDash?: boolean;
}

/**
 * @description get youtube information using `ytdl-core` npm package
 */
export async function getYoutubeInfo(id: string): Promise<GetYoutubeInfo> {
  const url = `https://www.youtube.com/watch?v=${id}`;

  try {
    const response = {
      title: undefined,
      image: undefined,
      url: undefined,
      isDash: undefined,
    };

    const info = await ytdl.getInfo(url);

    response.title = info.videoDetails.title;
    response.image =
      info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url;

    const audio = ytdl.chooseFormat(info.formats, {
      quality: '140',
    });

    response.url = audio.url;

    // if format is dash, we need an extra step to get the correct url
    if (audio.isDashMPD) {
      response.url = await getDashUrl(url);
      response.isDash = true;
    }

    return response;
  } catch (error) {
    throw new Error(error);
  }
}
