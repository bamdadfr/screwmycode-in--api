import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { YoutubeController } from './youtube.controller';
import { YoutubeService } from './youtube.service';
import { YoutubeEntity, YoutubeSchema } from './youtube.schema';

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
