/**
 * 인증 관련 타입 정의
 */

// 사용자 정보
export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// 로그인 요청
export interface LoginRequest {
  email: string;
  password: string;
}

// 회원가입 요청
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

// 토큰 응답
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// 토큰 + 사용자 정보 응답
export interface TokenWithUserResponse extends TokenResponse {
  user: User;
}

// 프로필 업데이트 요청
export interface UpdateProfileRequest {
  email?: string;
  username?: string;
  full_name?: string;
  password?: string;
}

// Refresh Token 요청
export interface RefreshTokenRequest {
  refresh_token: string;
}
