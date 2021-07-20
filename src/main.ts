import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { isEnvProduction } from './utils/is-env-production';

async function bootstrap() {
  console.log(`NODE_ENV in production? ${isEnvProduction()}`);

  const app = await NestFactory.create(AppModule);

  if (isEnvProduction()) {
    console.log('enabling CORS');
    app.enableCors({
      origin: /screwmycode\.in$/,
    });
  }

  app.use(helmet());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('title example')
    .setDescription('description example')
    .setVersion('1.0')
    .addTag('tag example')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, swaggerDocument);

  await app.listen(3000);
}

(async () => await bootstrap())();
