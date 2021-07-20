import { YoutubeController } from './youtube.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { YoutubeService } from './youtube.service';
import { MongooseModule } from '@nestjs/mongoose';
import { YoutubeEntity, YoutubeSchema } from './youtube.schema';
import { getMongoUrl } from '../utils/get-mongo-url';

describe('YoutubeController', () => {
  let controller: YoutubeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YoutubeController],
      providers: [YoutubeService],
      imports: [
        MongooseModule.forRoot(getMongoUrl()),
        MongooseModule.forFeature([
          {
            name: YoutubeEntity.name,
            schema: YoutubeSchema,
          },
        ]),
      ],
    }).compile();

    controller = module.get<YoutubeController>(YoutubeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return success: true', async () => {
      const response = await controller.findAll();
      expect(response).toStrictEqual({
        success: true,
      });
    });
  });

  describe('find', () => {
    it('should call service with arguments');
    it('should return youtube data');
  });
});
