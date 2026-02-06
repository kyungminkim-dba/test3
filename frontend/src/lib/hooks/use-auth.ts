/**
 * 인증 관련 커스텀 훅
 */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { LoginRequest, RegisterRequest, UpdateProfileRequest } from "@/types/auth";
import { AxiosError } from "axios";

// 에러 메시지 추출 헬퍼
const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.detail || "오류가 발생했습니다";
  }
  return "오류가 발생했습니다";
};

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuth, logout: logoutStore, user, isAuthenticated } = useAuthStore();

  // 로그인
  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      setAuth(response.user, response.access_token, response.refresh_token);
      toast.success("로그인 성공", {
        description: `${response.user.username}님 환영합니다!`,
      });
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error("로그인 실패", {
        description: getErrorMessage(error),
      });
    },
  });

  // 회원가입
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      setAuth(response.user, response.access_token, response.refresh_token);
      toast.success("회원가입 성공", {
        description: "계정이 생성되었습니다!",
      });
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error("회원가입 실패", {
        description: getErrorMessage(error),
      });
    },
  });

  // 로그아웃
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      toast.success("로그아웃 완료");
      router.push("/login");
    },
    onError: () => {
      // 서버 에러가 나도 클라이언트 로그아웃 처리
      logoutStore();
      queryClient.clear();
      router.push("/login");
    },
  });

  // 프로필 업데이트
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => authApi.updateProfile(data),
    onSuccess: (updatedUser) => {
      useAuthStore.getState().setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("프로필 업데이트 완료");
    },
    onError: (error) => {
      toast.error("프로필 업데이트 실패", {
        description: getErrorMessage(error),
      });
    },
  });

  // 계정 삭제
  const deleteAccountMutation = useMutation({
    mutationFn: () => authApi.deleteAccount(),
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      toast.success("계정이 삭제되었습니다");
      router.push("/login");
    },
    onError: (error) => {
      toast.error("계정 삭제 실패", {
        description: getErrorMessage(error),
      });
    },
  });

  return {
    // 상태
    user,
    isAuthenticated,

    // 로그인
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,

    // 회원가입
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,

    // 로그아웃
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,

    // 프로필 업데이트
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,

    // 계정 삭제
    deleteAccount: deleteAccountMutation.mutate,
    isDeletingAccount: deleteAccountMutation.isPending,
  };
}

// 현재 사용자 정보 조회 훅 (서버에서 최신 정보)
export function useCurrentUser() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => authApi.getCurrentUser(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5분
  });
}
