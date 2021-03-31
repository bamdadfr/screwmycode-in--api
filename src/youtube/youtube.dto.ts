export class YoutubeDto {
  success: boolean;
  data?: {
    title: string;
    url: string;
    hits: number;
  };
  error?: {
    message: string;
  };
}
