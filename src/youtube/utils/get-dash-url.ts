import { XMLParser } from 'fast-xml-parser';

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return fetch(...args);
  });

/**
 * @description parse dash file (XML) and get audio URL
 */
export async function getDashUrl(url: string): Promise<string | Error> {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new XMLParser({ ignoreAttributes: false });
        const json = parser.parse(text);
        resolve(json.MPD.Period.AdaptationSet[1].Representation.BaseURL);
      } catch (error) {
        reject(error);
      }
    })();
  });
}
