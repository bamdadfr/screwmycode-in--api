import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it('should define the controller', () => {
    expect(controller).toBeDefined();
  });

  it('should define the service', () => {
    expect(service).toBeDefined();
  });
});
