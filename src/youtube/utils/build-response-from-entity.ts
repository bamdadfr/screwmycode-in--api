import { ReadYoutubeDto } from '../dto/read-youtube.dto';
import { YoutubeEntity } from '../youtube.schema';

/**
 * @description build controller response from service entity
 */
export function buildResponseFromEntity(
  document: YoutubeEntity,
): ReadYoutubeDto {
  return {
    success: true,
    data: {
      title: document.title,
      image: document.image,
      url: document.url,
      hits: document.hits,
    },
  };
}
