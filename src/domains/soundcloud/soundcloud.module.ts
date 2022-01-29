import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Soundcloud, SoundcloudSchema } from './schemas/soundcloud.schema.js';
import { SoundcloudController } from './soundcloud.controller.js';
import { SoundcloudService } from './soundcloud.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Soundcloud.name,
        schema: SoundcloudSchema,
      },
    ]),
  ],
  controllers: [SoundcloudController],
  providers: [SoundcloudService],
})
export class SoundcloudModule {}
