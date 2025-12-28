import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { SuccessResponseInterceptor } from './common/interceptors/success-response-interceptor.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new SuccessResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  app.enableCors({
    origin: [
      /^chrome-extension:\/\/[a-z]{32}$/, // Chrome Extension ID 패턴
      'http://localhost:5173', // 개발용 웹 서버
      'http://localhost:3000', // 개발용 API 테스트
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
