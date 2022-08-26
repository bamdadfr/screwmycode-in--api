import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { isEnvProduction } from './utils/is-env-production.js';

async function bootstrap() {
  console.log(`NODE_ENV in production? ${isEnvProduction()}`);

  const app = await NestFactory.create(AppModule);

  if (isEnvProduction()) {
    console.log('enabling CORS for screwmycode.in domain only');
    app.enableCors({
      origin: /screwmycode\.in$/,
    });
  } else {
    console.log('enabling CORS for all origins');
    app.enableCors({
      origin: /.*$/,
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  app.use(helmet());

  await app.listen(3000);
}

(async () => await bootstrap())();
