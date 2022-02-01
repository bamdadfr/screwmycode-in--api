import { SoundcloudDto } from '../../soundcloud/dto/soundcloud.dto.js';
import { YoutubeDto } from '../../youtube/dto/youtube.dto.js';

export type RootTopDto = {
  id: YoutubeDto['id'] | SoundcloudDto['id'];
  hits: number;
  title: string;
  type: 'youtube' | 'soundcloud';
  image: YoutubeDto['image'] | SoundcloudDto['image'];
};

export interface RootLatestDto extends RootTopDto {
  updatedAt?: string;
}
