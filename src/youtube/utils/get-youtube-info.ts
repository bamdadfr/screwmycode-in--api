// eslint-disable-next-line @typescript-eslint/no-var-requires
const ytdl = require('ytdl-core');
import { getDashUrl } from './get-dash-url';

export class GetYoutubeInfo {
  title?: string;
  url?: string;
  isDash?: boolean;
}

/**
 * @function getYoutubeInfo
 * @description get youtube information using `ytdl-core` npm package
 * @param {string} id - youtube id
 * @returns {object}
 */
export async function getYoutubeInfo(id: string): Promise<GetYoutubeInfo> {
  const url = `https://www.youtube.com/watch?v=${id}`;

  try {
    let response;

    const info = await ytdl.getInfo(url, {
      filter: 'audio',
    });

    response = {
      title: info.videoDetails.title,
    };

    const audio = ytdl.chooseFormat(info.formats, {
      quality: '140',
    });

    response = {
      ...response,
      url: audio.url,
    };

    // if format is dash, we need an extra step to get the correct url
    if (audio.isDashMPD) {
      const dashUrl = await getDashUrl(url);
      response = {
        ...response,
        url: dashUrl,
        isDash: true,
      };
    }

    return response;
  } catch (error) {
    throw new Error(error);
  }
}
