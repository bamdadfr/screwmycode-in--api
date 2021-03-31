import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type YoutubeDocument = Youtube & Document;

@Schema()
export class Youtube {
  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  url: string;

  @Prop()
  expireDate: number;

  @Prop()
  hit: number;
}

export const YoutubeSchema = SchemaFactory.createForClass(Youtube);
