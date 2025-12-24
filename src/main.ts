import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { SuccessResponseInterceptor } from './common/interceptors/success-response-interceptor.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new SuccessResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
