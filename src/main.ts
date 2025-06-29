import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log('DDDDD', process.env.CORS_ORIGIN);
  app.use(cookieParser());
  app.enableCors({
    origin: JSON.parse(process.env.CORS_ORIGIN),
    methods: JSON.parse(process.env.CORS_METHOD),
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.listen(process.env.PORT);
}
bootstrap();
