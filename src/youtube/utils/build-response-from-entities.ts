import { YoutubeEntity } from '../youtube.schema';
import { ReadYoutubesDto } from '../dto/read-youtubes.dto';

export function buildResponseFromEntities(
  documents: YoutubeEntity[],
): ReadYoutubesDto {
  let data = [];

  documents.forEach((document) => {
    data = [
      ...data,
      {
        id: document.id,
        title: document.title,
        image: document.image,
        hits: document.hits,
      },
    ];
  });

  return {
    success: true,
    data,
  };
}
