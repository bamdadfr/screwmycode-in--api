export class ReadYoutubeDto {
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
