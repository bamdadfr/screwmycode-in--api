import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Youtube {
  @Prop({
    required: true,
    unique: true,
  })
  id: string;

  @Prop()
  title: string;

  @Prop()
  image: string;

  @Prop()
  audio: string;

  @Prop()
  expireDate: number;

  @Prop()
  hits: number;
}

export type YoutubeDocument = Youtube & Document;
export const YoutubeSchema = SchemaFactory.createForClass(Youtube);
