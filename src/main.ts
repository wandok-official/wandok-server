import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
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

  const configService = app.get(ConfigService);
  const corsOriginsStr = configService.get<string>('CORS_ALLOWED_ORIGINS') || '';
  const corsOrigins = corsOriginsStr.split(',').filter(Boolean);

  app.enableCors({
    origin: [/^chrome-extension:\/\/[a-p]{32}$/, ...corsOrigins],
    credentials: true,
  });

  await app.listen(configService.get<number>('PORT') || 3000);
}

await bootstrap();
