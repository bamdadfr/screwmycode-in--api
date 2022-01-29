import SoundcloudScraper from 'soundcloud-scraper';
import { BadRequestException } from '@nestjs/common';

export async function validateSoundcloudUrl(url: string) {
  if (typeof url === 'undefined') {
    throw new BadRequestException('url is required');
  }

  const isValid = SoundcloudScraper.Util.validateURL(url);

  if (!isValid) {
    throw new BadRequestException(`Soundcloud ID is not valid`);
  }

  try {
    const scraper = new SoundcloudScraper.Client();
    await scraper.getSongInfo(url);
  } catch (error) {
    throw new BadRequestException(`Soundcloud ID does not exist`);
  }
}
