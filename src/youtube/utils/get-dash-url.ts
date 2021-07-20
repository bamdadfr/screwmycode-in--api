import fetch from 'node-fetch';
import parser from 'fast-xml-parser';

/**
 * @description parse dash file (XML) and get audio URL
 */
export async function getDashUrl(url: string): Promise<string | Error> {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const response = await fetch(url);
        const text = await response.text();

        const json = parser.parse(text, {
          ignoreAttributes: false,
        });

        resolve(json.MPD.Period.AdaptationSet[1].Representation.BaseURL);
      } catch (error) {
        reject(error);
      }
    })();
  });
}
