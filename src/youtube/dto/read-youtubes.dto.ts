export class ReadYoutubesDto {
  success: boolean;
  data: {
    id: string;
    title: string;
    hits: number;
  }[];
}
