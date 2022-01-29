import { Youtube } from '../schemas/youtube.schema.js';
import { YoutubeDto } from '../dto/youtube.dto.js';
import { generatePipedYoutubeImage } from './generate-piped-youtube-image.js';
import { generatePipedYoutubeAudio } from './generate-piped-youtube-audio.js';

export function generateYoutubeDto(entity: Youtube): YoutubeDto {
  return {
    id: entity.id,
    hits: entity.hits,
    title: entity.title,
    image: generatePipedYoutubeImage(entity),
    audio: generatePipedYoutubeAudio(entity),
  };
}
