import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { YoutubeModule } from './domains/youtube/youtube.module.js';
import { getMongoUrl } from './utils/get-mongo-url.js';
import { SoundcloudModule } from './domains/soundcloud/soundcloud.module.js';
import { RootModule } from './domains/root/root.module.js';

@Module({
  imports: [
    MongooseModule.forRoot(getMongoUrl()),
    YoutubeModule,
    SoundcloudModule,
    RootModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
