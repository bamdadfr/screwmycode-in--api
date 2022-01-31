import { SoundcloudDto } from '../../soundcloud/dto/soundcloud.dto';
import { YoutubeDto } from '../../youtube/dto/youtube.dto';

export interface RootYoutubeTop {
  id: YoutubeDto['id'];
  hits: number;
  title: string;
  type: 'youtube';
  image: YoutubeDto['image'];
}

// TODO: Inspect NestJS decorator
export interface RootYoutubeLatest extends RootYoutubeTop {
  updatedAt?: string;
}

export interface RootSoundcloudTop {
  id: SoundcloudDto['id'];
  hits: number;
  title: string;
  type: 'soundcloud';
  image: SoundcloudDto['image'];
}

// TODO: Inspect NestJS decorator
export interface RootSoundcloudLatest extends RootSoundcloudTop {
  updatedAt?: string;
}

export type RootTopDto = (RootYoutubeTop | RootSoundcloudTop)[];
export type RootLatestDto = (RootYoutubeLatest | RootSoundcloudLatest)[];
