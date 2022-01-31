import { GetDomain } from '../../../utils/get-domain.js';

export class YoutubeDto {
  id: string;
  hits: number;
  title: string;
  image: `${GetDomain}/youtube/${this['id']}/image`;
  audio: `${GetDomain}/youtube/${this['id']}/audio`;
}
