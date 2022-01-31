import { YoutubeDocument } from '../../youtube/schemas/youtube.schema.js';
import { SoundcloudDocument } from '../../soundcloud/schemas/soundcloud.schema.js';
import { appendType } from '../../../utils/append-type.js';
import { getPipedYoutubeMedia } from '../../youtube/utils/get-piped-youtube-media.js';

type MergeDocumentsProps = {
  soundcloudDocuments: SoundcloudDocument[];
  youtubeDocuments: YoutubeDocument[];
};

export function mergeDocuments({
  soundcloudDocuments,
  youtubeDocuments,
}: MergeDocumentsProps): any {
  const soundcloudEntities = appendType('soundcloud', soundcloudDocuments);

  const youtubesPiped = youtubeDocuments.map((document) => {
    document.image = getPipedYoutubeMedia(document, 'image');
    return document;
  });
  const youtubeEntities = appendType('youtube', youtubesPiped);

  return [...soundcloudEntities, ...youtubeEntities];
}
