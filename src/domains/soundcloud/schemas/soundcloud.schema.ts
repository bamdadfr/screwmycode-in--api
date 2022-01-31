import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Soundcloud {
  // username/trackName
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  hits: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  audio: string;

  @Prop()
  stream: string;
}

export type SoundcloudDocument = Soundcloud & Document;
export const SoundcloudSchema = SchemaFactory.createForClass(Soundcloud);
