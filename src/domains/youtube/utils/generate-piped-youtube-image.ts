import { getDomain } from '../../../utils/get-domain.js';
import { Youtube } from '../schemas/youtube.schema.js';

export function generatePipedYoutubeImage(entity: Youtube): string {
  return `${getDomain()}/youtube/${entity.id}/image`;
}
