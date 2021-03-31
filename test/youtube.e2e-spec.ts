import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { YoutubeModule } from '../src/youtube/youtube.module';

describe('YoutubeController (e2e)', () => {
  let server;
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, YoutubeModule],
    }).compile();

    app = module.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  it('@Get /youtube should succeed', async () => {
    const response = await request(server).get('/youtube');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('@Get /youtube/UY6dvVeuzk4 should succeed', async () => {
    const response = await request(server).get('/youtube/UY6dvVeuzk4');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.title).toBeDefined();
    expect(response.body.data.url).toBeDefined();
    expect(response.body.data.hit).toBeDefined();
    expect(response.body.error).toBeUndefined();
  });

  it('@Get /youtube/q3WzYdFyAqc should fail', async () => {
    const response = await request(server).get('/youtube/q3WzYdFyAqc');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body.data).toBeUndefined();
    expect(response.body.error).toBeDefined();
    expect(response.body.error.message).toBeDefined();
  });

  it('@Get /youtube/invalid should fail', async () => {
    const response = await request(server).get('/youtube/invalid');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body.data).toBeUndefined();
    expect(response.body.error).toBeDefined();
    expect(response.body.error.message).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
