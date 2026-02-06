/**
 * 보호된 레이아웃
 * - 인증이 필요한 모든 페이지에 적용
 * - AuthGuard로 래핑하여 인증 체크
 * - Header 컴포넌트 포함
 */

import { AuthGuard } from "@/components/auth/auth-guard";
import { Header } from "@/components/layout/header";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </AuthGuard>
  );
}
