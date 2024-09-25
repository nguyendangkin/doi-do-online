import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // Specify the type as NestExpressApplication

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:5173', // Address of the frontend
    credentials: true, // Allow cookies
  });
  app.useGlobalPipes(new ValidationPipe());

  // Use static assets for the express app
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(3000);
}

bootstrap();
