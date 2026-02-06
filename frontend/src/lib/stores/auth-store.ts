/**
 * Zustand 인증 스토어
 * - 사용자 정보 및 토큰 상태 관리
 * - localStorage persist로 새로고침 시에도 상태 유지
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types/auth";

// 쿠키 설정 헬퍼 함수 (미들웨어에서 인증 상태 확인용)
const setAuthCookie = (token: string) => {
  if (typeof document !== "undefined") {
    // 7일 만료 (refresh token과 동일)
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `auth-token=${token}; path=/; expires=${expires}; SameSite=Lax`;
  }
};

const removeAuthCookie = () => {
  if (typeof document !== "undefined") {
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

interface AuthState {
  // 상태
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  // 액션
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 초기 상태
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isHydrated: false,

      // 로그인 성공 시 전체 인증 정보 설정
      setAuth: (user, accessToken, refreshToken) => {
        setAuthCookie(accessToken); // 미들웨어용 쿠키 설정
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      // Access Token만 갱신 (토큰 리프레시 시)
      setAccessToken: (token) => {
        setAuthCookie(token); // 미들웨어용 쿠키 업데이트
        set({
          accessToken: token,
        });
      },

      // Refresh Token만 갱신
      setRefreshToken: (token) =>
        set({
          refreshToken: token,
        }),

      // 사용자 정보만 갱신 (프로필 업데이트 시)
      setUser: (user) =>
        set({
          user,
        }),

      // 로그아웃
      logout: () => {
        removeAuthCookie(); // 미들웨어용 쿠키 삭제
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      // 하이드레이션 완료 상태 설정
      setHydrated: (hydrated) =>
        set({
          isHydrated: hydrated,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // accessToken은 메모리에만 유지하고 싶다면 partialize 사용
      // 현재는 refreshToken을 persist하여 새로고침 시 재로그인 방지
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);

// 하이드레이션 완료 대기 훅
export const useAuthHydration = () => {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  return isHydrated;
};
