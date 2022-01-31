import { getDomain } from '../../../utils/get-domain.js';
import { Youtube } from '../schemas/youtube.schema.js';

type Media = 'image' | 'audio';

export function getPipedYoutubeMedia(youtube: Youtube, media: Media): string {
  return `${getDomain()}/youtube/${youtube.id}/${media}`;
}
