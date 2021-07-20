import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type YoutubeDocument = YoutubeEntity & Document;

@Schema()
export class YoutubeEntity {
  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  url: string;

  @Prop()
  expireDate: number;

  @Prop()
  hits: number;
}

export const YoutubeSchema = SchemaFactory.createForClass(YoutubeEntity);
