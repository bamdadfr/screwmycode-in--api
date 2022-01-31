import { Soundcloud } from '../schemas/soundcloud.schema.js';
import { getDomain } from '../../../utils/get-domain.js';

type Media = 'image' | 'audio';

export function getPipedSoundcloudMedia(
  soundcloud: Soundcloud,
  media: Media,
): string {
  return `${getDomain()}/soundcloud/${soundcloud.id}/${media}`;
}
