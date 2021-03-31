// eslint-disable-next-line @typescript-eslint/no-var-requires
const ytdl = require('ytdl-core');
import { getDashUrl } from './get-dash-url';

export class GetYoutubeInfo {
  title?: string;
  url?: string;
  isDash?: boolean;
}

/**
 * getYoutubeInfo()
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

    /**
     * add title to response
     */
    response = {
      title: info.videoDetails.title,
    };

    const format = ytdl.chooseFormat(info.formats, {
      quality: '140',
    });

    /**
     * add url to response
     */
    response = {
      ...response,
      url: format.url,
    };

    /**
     * if format is dash:
     * we need an extra step to parse and get a correct url
     */
    if (format.isDashMPD) {
      const dashUrl = await getDashUrl(url);
      response = {
        ...response,
        url: dashUrl,
        isDash: true,
      };
    }

    return response;
  } catch (error) {
    throw Error(error);
  }
}
