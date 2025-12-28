import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service.js';
import { getAuthConfig } from '../config/auth.config.js';

interface JwtPayload {
  sub: string; // Subject: 사용자 ID
  iat?: number; // Issued At: 발급 시간
  exp?: number; // Expiration: 만료 시간
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    const authConfig = getAuthConfig(configService);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authConfig.secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findByIdForAuth(payload.sub);

    return user;
  }
}
