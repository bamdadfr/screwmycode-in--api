import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { YoutubeService } from './youtube.service';
import { YoutubeEntity, YoutubeSchema } from './youtube.schema';
import {
  closeMongoConnection,
  MongoTestModule,
} from '../../test/mongo-test.module';
import { YoutubeController } from './youtube.controller';

describe('YoutubeService', () => {
  let service: YoutubeService;

  afterAll(async () => {
    await closeMongoConnection();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongoTestModule(),
        MongooseModule.forFeature([
          {
            name: YoutubeEntity.name,
            schema: YoutubeSchema,
          },
        ]),
      ],
      controllers: [YoutubeController],
      providers: [YoutubeService],
    }).compile();

    service = module.get<YoutubeService>(YoutubeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
