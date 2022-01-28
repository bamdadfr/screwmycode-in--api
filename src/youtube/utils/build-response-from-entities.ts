import { YoutubeEntity } from '../youtube.schema.js';
import { buildResponseFromEntity } from './build-response-from-entity.js';
import { ReadYoutubeDto } from '../dto/read-youtube.dto.js';

export function buildResponseFromEntities(
  documents: YoutubeEntity[],
): ReadYoutubeDto[] {
  let data = [];

  documents.forEach((document) => {
    const entity = buildResponseFromEntity(document);
    data = [
      ...data,
      {
        id: entity.id,
        title: entity.title,
        image: entity.image,
        audio: entity.audio,
        hits: entity.hits,
      },
    ];
  });

  return data;
}
