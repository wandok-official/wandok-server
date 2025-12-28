import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from '../users/users.service.js';
import { GoogleAuthDto, LoginResponseDto } from './dto/auth.dto.js';
import { getAuthConfig } from './config/auth.config.js';

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {
    const authConfig = getAuthConfig(this.configService);
    this.googleClient = new OAuth2Client(authConfig.googleClientId);
  }

  /**
   * Google Access Token을 검증하고 사용자 정보를 반환
   */
  async validateGoogleToken(token: string): Promise<GoogleAuthDto> {
    try {
      const tokenInfo = await this.googleClient.getTokenInfo(token);

      if (!tokenInfo.email) {
        throw new UnauthorizedException('Email not found in Google token');
      }

      // Google API에서 사용자 프로필 정보 가져오기
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`
      );

      if (!response.ok) {
        throw new UnauthorizedException('Failed to fetch user info from Google');
      }

      const userInfo = (await response.json()) as { email: string; name: string; picture?: string };

      return {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  /**
   * JWT 토큰 생성
   */
  generateJwt(userId: string, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }

  /**
   * Google OAuth 로그인 처리
   */
  async login(googleToken: string): Promise<LoginResponseDto> {
    const googleUserInfo = await this.validateGoogleToken(googleToken);
    const user = await this.usersService.findOrCreate(googleUserInfo.email, googleUserInfo.name);
    const accessToken = this.generateJwt(user.id, user.email);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname || '',
      },
    };
  }
}
