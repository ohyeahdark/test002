// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <-- Import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Kích hoạt ValidationPipe trên toàn bộ ứng dụng
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Tự động loại bỏ các thuộc tính không được định nghĩa trong DTO
  }));

  await app.listen(3000);
}
bootstrap();