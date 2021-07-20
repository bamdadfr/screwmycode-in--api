import { YoutubeModule } from './youtube.module';
import { Test, TestingModule } from '@nestjs/testing';
import { YoutubeController } from './youtube.controller';
import { YoutubeService } from './youtube.service';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoUrl } from '../utils/get-mongo-url';

describe('YoutubeModule', () => {
  let controller: YoutubeController;
  let service: YoutubeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [YoutubeModule, MongooseModule.forRoot(getMongoUrl())],
    }).compile();

    controller = module.get<YoutubeController>(YoutubeController);
    service = module.get<YoutubeService>(YoutubeService);
  });

  it('should define the controller', () => {
    expect(controller).toBeDefined();
  });

  it('should define the service', () => {
    expect(service).toBeDefined();
  });
});
