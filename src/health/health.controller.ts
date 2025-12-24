import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthcheckController {
  @Get('health')
  checkHealth() {
    return { status: 'ok' };
  }
}
