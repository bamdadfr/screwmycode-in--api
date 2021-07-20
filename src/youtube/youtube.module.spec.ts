import { YoutubeModule } from './youtube.module';
import { Test, TestingModule } from '@nestjs/testing';
import { YoutubeController } from './youtube.controller';
import { YoutubeService } from './youtube.service';
import {
  closeMongoConnection,
  MongoTestModule,
} from '../../test/mongo-test.module';

describe('YoutubeModule', () => {
  let controller: YoutubeController;
  let service: YoutubeService;

  afterAll(async () => {
    await closeMongoConnection();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [YoutubeModule, MongoTestModule()],
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
