import { ReadYoutubeDto } from '../dto/read-youtube.dto.js';
import { YoutubeEntity } from '../youtube.schema.js';
import { getDomain } from '../../utils/get-domain.js';

/**
 * @description build controller response from service entity
 */
export function buildResponseFromEntity(
  document: YoutubeEntity,
): ReadYoutubeDto {
  // todo: inject provider after soundcloud has been added to API
  const image = `${getDomain()}/youtube/${document.id}/image`;
  const audio = `${getDomain()}/youtube/${document.id}/audio`;

  return {
    id: document.id,
    title: document.title,
    image,
    audio,
    hits: document.hits,
  };
}
