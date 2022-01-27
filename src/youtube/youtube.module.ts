import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { YoutubeController } from './youtube.controller.js';
import { YoutubeService } from './youtube.service.js';
import { YoutubeEntity, YoutubeSchema } from './youtube.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: YoutubeEntity.name,
        schema: YoutubeSchema,
      },
    ]),
  ],
  controllers: [YoutubeController],
  providers: [YoutubeService],
})
export class YoutubeModule {}
