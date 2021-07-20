import { YoutubeController } from './youtube.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { YoutubeService } from './youtube.service';
import {
  closeMongoConnection,
  MongoTestModule,
} from '../../test/mongo-test.module';
import { MongooseModule } from '@nestjs/mongoose';
import { YoutubeEntity, YoutubeSchema } from './youtube.schema';

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
            name: YoutubeEntity.name,
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

  describe('findAll', () => {
    it('should return success: true', async () => {
      const response = await controller.findAll();
      expect(response).toStrictEqual({
        success: true,
      });
    });
  });

  describe('find', () => {
    describe('when id is valid', () => {
      it('should return success: true', async () => {
        const response = await controller.find('UY6dvVeuzk4');
        expect(response.success).toBe(true);
      });

      it('should return a defined data object', async () => {
        const response = await controller.find('UY6dvVeuzk4');
        expect(response.data).toBeDefined();
      });

      it('should return a defined data.title value', async () => {
        const response = await controller.find('UY6dvVeuzk4');
        expect(response.data.title).toBeDefined();
      });

      it('should return a defined data.url value', async () => {
        const response = await controller.find('UY6dvVeuzk4');
        expect(response.data.url).toBeDefined();
      });

      it('should return a defined data.hits value', async () => {
        const response = await controller.find('UY6dvVeuzk4');
        expect(response.data.hits).toBeDefined();
      });
    });

    describe('when id is not valid', () => {
      it('should return success: true', async () => {
        const response = await controller.find('zeikorjzeiuofh');
        expect(response.success).toBe(false);
      });

      it('should return a defined error object', async () => {
        const response = await controller.find('zeikorjzeiuofh');
        expect(response.error).toBeDefined();
      });

      it('should return a defined error.message value', async () => {
        const response = await controller.find('zeikorjzeiuofh');
        expect(response.error.message).toBeDefined();
      });
    });
  });
});
