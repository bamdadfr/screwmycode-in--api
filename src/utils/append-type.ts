import {
  YoutubeDocument,
  Youtube,
} from '../domains/youtube/schemas/youtube.schema.js';
import {
  Soundcloud,
  SoundcloudDocument,
} from '../domains/soundcloud/schemas/soundcloud.schema.js';

type Type = 'youtube' | 'soundcloud';

export type TypedEntity = (Soundcloud | Youtube) & {
  type: Type;
};

export function appendType(
  type: Type,
  documents: YoutubeDocument[] | SoundcloudDocument[],
) {
  return documents.map((doc: YoutubeDocument | SoundcloudDocument) => {
    const obj: TypedEntity = {
      ...doc.toObject(),
      type,
    };
    return obj;
  });
}
