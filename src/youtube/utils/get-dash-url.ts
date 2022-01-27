import { XMLParser } from 'fast-xml-parser';
import got from 'got';

/**
 * @description parse dash file (XML) and get audio URL
 */
export async function getDashUrl(url: string): Promise<string | Error> {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const response = await got.get(url).text();
        const parser = new XMLParser({ ignoreAttributes: false });
        const json = parser.parse(response);
        resolve(json.MPD.Period.AdaptationSet[1].Representation.BaseURL);
      } catch (error) {
        reject(error);
      }
    })();
  });
}
