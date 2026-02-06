/**
 * 인증 API 함수
 */

import apiClient from "./client";
import type {
  LoginRequest,
  RegisterRequest,
  TokenWithUserResponse,
  TokenResponse,
  User,
  UpdateProfileRequest,
  RefreshTokenRequest,
} from "@/types/auth";

export const authApi = {
  /**
   * 로그인
   */
  login: async (data: LoginRequest): Promise<TokenWithUserResponse> => {
    const response = await apiClient.post<TokenWithUserResponse>(
      "/api/v1/auth/login",
      data
    );
    return response.data;
  },

  /**
   * 회원가입
   */
  register: async (data: RegisterRequest): Promise<TokenWithUserResponse> => {
    const response = await apiClient.post<TokenWithUserResponse>(
      "/api/v1/auth/register",
      data
    );
    return response.data;
  },

  /**
   * 토큰 갱신
   */
  refresh: async (data: RefreshTokenRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>(
      "/api/v1/auth/refresh",
      data
    );
    return response.data;
  },

  /**
   * 로그아웃
   */
  logout: async (): Promise<void> => {
    await apiClient.post("/api/v1/auth/logout");
  },

  /**
   * 현재 사용자 정보 조회
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>("/api/v1/users/me");
    return response.data;
  },

  /**
   * 프로필 업데이트
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.put<User>("/api/v1/users/me", data);
    return response.data;
  },

  /**
   * 계정 삭제
   */
  deleteAccount: async (): Promise<void> => {
    await apiClient.delete("/api/v1/users/me");
  },
};

export default authApi;
