import type { ConfigService } from '@nestjs/config';

/**
 * JWT 인증 설정을 정의하는 인터페이스
 */
export interface AuthConfig {
  /** JWT 비밀키 */
  secret: string;
  /** JWT 토큰 만료 시간 (예: "7d", "24h") */
  expiresIn: string;
}

/**
 * 환경 변수에서 JWT 인증 설정을 로드합니다.
 * 필수 환경 변수가 없으면 에러를 발생시킵니다.
 *
 * @param configService - NestJS ConfigService 인스턴스
 * @returns JWT 인증 설정 객체
 * @throws Error - JWT_SECRET 또는 JWT_EXPIRATION이 정의되지 않은 경우
 */
export const getAuthConfig = (configService: ConfigService): AuthConfig => {
  const secret = configService.get<string>('JWT_SECRET');
  const expiresIn = configService.get<string>('JWT_EXPIRATION');

  if (!secret) {
    throw new Error(
      'JWT_SECRET is not defined in environment variables. ' +
        'Please set JWT_SECRET in your .env file.'
    );
  }

  if (!expiresIn) {
    throw new Error(
      'JWT_EXPIRATION is not defined in environment variables. ' +
        'Please set JWT_EXPIRATION in your .env file (e.g., "7d", "24h").'
    );
  }

  return {
    secret,
    expiresIn,
  };
};
