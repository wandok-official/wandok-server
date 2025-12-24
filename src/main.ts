import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { SuccessResponseInterceptor } from './common/interceptors/success-response-interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new SuccessResponseInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
