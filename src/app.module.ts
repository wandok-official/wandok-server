import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HealthcheckController } from './health/health.controller.js';

@Module({
  imports: [],
  controllers: [AppController, HealthcheckController],
  providers: [AppService],
})
export class AppModule {}
