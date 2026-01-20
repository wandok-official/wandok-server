import {
  Controller,
  Post,
  Get,
  Headers,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { AuthService } from './auth.service.js';

interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    nickname: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async googleLogin(@Headers('authorization') authorization: string | undefined) {
    // Authorization 헤더 검증
    if (!authorization) {
      throw new BadRequestException('Authorization header missing or invalid');
    }

    const token = authorization.replace(/^Bearer\s+/i, '');
    if (!token || token === authorization) {
      throw new BadRequestException('Authorization header missing or invalid');
    }

    return this.authService.login(token);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: AuthRequest) {
    return req.user;
  }
}
