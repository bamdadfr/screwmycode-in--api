import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { YoutubeController } from './youtube.controller.js';
import { YoutubeService } from './youtube.service.js';
import { Youtube, YoutubeSchema } from './schemas/youtube.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Youtube.name,
        schema: YoutubeSchema,
      },
    ]),
  ],
  controllers: [YoutubeController],
  providers: [YoutubeService],
})
export class YoutubeModule {}
