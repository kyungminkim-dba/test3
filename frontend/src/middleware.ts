/**
 * Next.js 미들웨어
 * 라우트 보호 및 리디렉션
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 보호된 라우트 (로그인 필요)
const protectedRoutes = ["/dashboard", "/profile"];

// 인증 라우트 (로그인 시 접근 불가)
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // auth-storage 쿠키 또는 localStorage에서 토큰 확인
  // 미들웨어에서는 쿠키만 접근 가능하므로 클라이언트에서 설정한 쿠키 사용
  const authToken = request.cookies.get("auth-token")?.value;

  // 보호된 라우트: 토큰 없으면 로그인으로 리디렉트
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 인증 라우트: 토큰 있으면 대시보드로 리디렉트
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute && authToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청에 매칭:
     * - api (API 라우트)
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico (파비콘)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
