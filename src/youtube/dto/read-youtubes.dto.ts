export class ReadYoutubesDto {
  success: boolean;
  data: {
    id: string;
    title: string;
    image: string;
    hits: number;
  }[];
}
