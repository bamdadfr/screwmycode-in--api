import { GetDomain } from '../../../utils/get-domain.js';

export class SoundcloudDto {
  id: string;
  hits: number;
  title: string;
  image: `${GetDomain}/soundcloud/${this['id']}/image`;
  audio: `${GetDomain}/soundcloud/${this['id']}/audio`;
}
