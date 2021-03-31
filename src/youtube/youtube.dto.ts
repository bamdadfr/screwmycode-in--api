export class YoutubeDto {
  success: boolean;
  data?: {
    title: string;
    url: string;
    hit: number;
  };
  error?: {
    message: string;
  };
}
