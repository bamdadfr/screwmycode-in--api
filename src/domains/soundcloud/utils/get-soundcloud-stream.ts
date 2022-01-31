import { Soundcloud } from '../schemas/soundcloud.schema.js';
import SoundcloudScraper from 'soundcloud-scraper';

export function getSoundcloudStream(url: Soundcloud['audio']) {
  return SoundcloudScraper.Util.fetchSongStreamURL(url, undefined);
}
