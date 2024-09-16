import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { JwtExceptionFilter } from 'src/auth/JwtExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new JwtExceptionFilter());
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:5173', // Địa chỉ của frontend
    credentials: true, // Cho phép gửi cookie
  });

  await app.listen(3000);
}

bootstrap();
