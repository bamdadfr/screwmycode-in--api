import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log(`NODE_ENV is: ${process.env.NODE_ENV}`);

  const app = await NestFactory.create(AppModule);
  app.enableCors();
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
