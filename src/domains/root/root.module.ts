import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Soundcloud,
  SoundcloudSchema,
} from '../soundcloud/schemas/soundcloud.schema.js';
import { Youtube, YoutubeSchema } from '../youtube/schemas/youtube.schema.js';
import { RootController } from './root.controller.js';
import { RootService } from './root.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Soundcloud.name,
        schema: SoundcloudSchema,
      },
      {
        name: Youtube.name,
        schema: YoutubeSchema,
      },
    ]),
  ],
  controllers: [RootController],
  providers: [RootService],
})
export class RootModule {}
