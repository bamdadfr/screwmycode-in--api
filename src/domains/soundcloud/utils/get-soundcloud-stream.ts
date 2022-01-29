import { Soundcloud } from '../schemas/soundcloud.schema.js';
import SoundcloudScraper from 'soundcloud-scraper';

export function getSoundcloudStream(soundcloud: Soundcloud) {
  return SoundcloudScraper.Util.fetchSongStreamURL(soundcloud.audio, undefined);
}
