import { Controller, Post, Get, Headers, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    nickname: string;
  };
}

@Controller('auth')
export class AuthController {
  @Post('google')
  // 현재 PR에서 사용하지 않아 발생하지 않는 ESLint 에러이므로 무시하는 주석을 추가 함.
  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
  async googleLogin(@Headers('authorization') authorization: string) {
    /*
    TODO: 다음 PR에서 AuthService.googleLogin()으로 교체 예정

    실제 구현 (다음 PR):
    const result = await this.authService.googleLogin(authorization);
    return result;
    */

    // 반환값 예시 (Mock 데이터) => 다음 PR에서 실제 구현 시 삭제
    const mockToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcx' +
      'Ni00NDY2NTU0NDAwMDAiLCJlbWFpbCI6InVzZXJAZ21haWwuY29tIiwiaWF0IjoxNzAzNTg5NjAwLC' +
      'JleHAiOjE3MDQxOTQ0MDB9.mock_signature';

    return {
      accessToken: mockToken,
      user: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'user@gmail.com',
        nickname: '사용자 1',
      },
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  // 현재 PR에서 사용하지 않아 발생하지 않는 ESLint 에러이므로 무시하는 주석을 추가 함.
  // eslint-disable-next-line @typescript-eslint/require-await
  async getProfile(@Request() req: AuthRequest) {
    // JWT 검증 시스템 테스트용 엔드포인트
    //
    // 유효한 JWT 토큰이 필요함 (Mock 토큰으로는 테스트 불가)
    // 다음 PR에서 실제 JWT 발급 기능 추가 후 테스트 가능
    return req.user;
  }
}
