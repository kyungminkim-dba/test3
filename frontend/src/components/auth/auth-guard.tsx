"use client";

/**
 * 클라이언트 측 인증 가드
 * 보호된 페이지에서 인증 상태 확인
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useAuthHydration } from "@/lib/stores/auth-store";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const isHydrated = useAuthHydration();
  const { isAuthenticated, accessToken } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 하이드레이션 완료 대기
    if (!isHydrated) return;

    // 인증되지 않은 경우 로그인 페이지로 리디렉트
    if (!isAuthenticated || !accessToken) {
      router.replace("/login");
      return;
    }

    // 미들웨어용 쿠키 설정 (서버 사이드에서 확인용)
    document.cookie = `auth-token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

    setIsChecking(false);
  }, [isHydrated, isAuthenticated, accessToken, router]);

  // 하이드레이션 중이거나 인증 확인 중일 때 로딩 표시
  if (!isHydrated || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 인증된 경우에만 자식 렌더링
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
