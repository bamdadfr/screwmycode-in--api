import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { YoutubeModule } from './youtube/youtube.module.js';
import { getMongoUrl } from './utils/get-mongo-url.js';

@Module({
  imports: [MongooseModule.forRoot(getMongoUrl()), YoutubeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
