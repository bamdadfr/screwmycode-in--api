export class ReadYoutubeDto {
  success: boolean;
  data?: {
    title: string;
    image: string;
    url: string;
    hits: number;
  };
  error?: {
    message: string;
  };
}
