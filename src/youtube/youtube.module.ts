import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { YoutubeController } from './youtube.controller';
import { YoutubeService } from './youtube.service';
import { Youtube, YoutubeSchema } from './schemas/youtube.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Youtube.name, schema: YoutubeSchema }]),
  ],
  controllers: [YoutubeController],
  providers: [YoutubeService],
})
export class YoutubeModule {}
