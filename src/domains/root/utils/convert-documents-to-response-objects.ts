import { YoutubeDocument } from '../../youtube/schemas/youtube.schema.js';
import { SoundcloudDocument } from '../../soundcloud/schemas/soundcloud.schema.js';
import { getDomain } from '../../../utils/get-domain.js';
import { RootTopDto } from '../dto/root.dto.js';

export function convertDocumentsToResponseObjects(
  documents: (YoutubeDocument | SoundcloudDocument)[],
  type: 'youtube' | 'soundcloud',
): RootTopDto[] {
  return documents.map((document) => {
    return {
      ...document.toObject(),
      image: `${getDomain()}/${type}/${document.id}/image`,
      type,
    };
  });
}
