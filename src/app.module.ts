import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YoutubeModule } from './youtube/youtube.module';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoUrl } from './utils/get-mongo-url';

@Module({
  imports: [MongooseModule.forRoot(getMongoUrl()), YoutubeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
