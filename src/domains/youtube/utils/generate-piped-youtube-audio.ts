import { getDomain } from '../../../utils/get-domain.js';
import { Youtube } from '../schemas/youtube.schema.js';

export function generatePipedYoutubeAudio(entity: Youtube): string {
  return `${getDomain()}/youtube/${entity.id}/audio`;
}
