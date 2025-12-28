// Google OAuth에서 받을 데이터 형태
export class GoogleAuthDto {
  email: string;
  name: string;
  picture?: string;
}

// 로그인 성공 시 응답 형태
export class LoginResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    nickname: string;
  };
}
