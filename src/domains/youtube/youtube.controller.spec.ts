import { YoutubeController } from './youtube.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { YoutubeService } from './youtube.service';
import {
  closeMongoConnection,
  MongoTestModule,
} from '../../../test/mongo-test.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Youtube, YoutubeSchema } from './schemas/youtube.schema';

describe('YoutubeController', () => {
  let controller: YoutubeController;

  afterAll(async () => {
    await closeMongoConnection();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongoTestModule(),
        MongooseModule.forFeature([
          {
            name: Youtube.name,
            schema: YoutubeSchema,
          },
        ]),
      ],
      controllers: [YoutubeController],
      providers: [YoutubeService],
    }).compile();

    controller = module.get<YoutubeController>(YoutubeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findTop', () => {
    it('should return a response', async () => {
      const response = await controller.findTop();
      expect(response).toBeDefined();
    });
  });

  describe('findLatest', () => {
    it('should return a response', async () => {
      const response = await controller.findLatest();
      expect(response).toBeDefined();
    });
  });

  describe('find', () => {
    describe('with parameter valid', () => {
      const parameter = 'UY6dvVeuzk4';

      it('should return a valid response', async () => {
        const response = await controller.find(parameter);
        expect(response).toBeDefined();
        expect(response.id).toBeDefined();
        expect(response.title).toBeDefined();
        expect(response.image).toBeDefined();
        expect(response.audio).toBeDefined();
        expect(response.hits).toBeDefined();
      });
    });

    describe('with parameter not valid', () => {
      const parameter = 'aiudhjazioudhsf';

      it('should throw', async () => {
        await expect(controller.find(parameter)).rejects.toThrow();
      });
    });
  });
});
