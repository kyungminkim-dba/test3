/**
 * 대시보드 페이지
 * - 로그인 후 메인 페이지
 * - 사용자 환영 메시지
 * - 기본 대시보드 UI
 */

"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Mail, Calendar } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* 환영 메시지 */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            안녕하세요, {user.username}님! 👋
          </h1>
          <p className="text-muted-foreground">
            대시보드에 오신 것을 환영합니다.
          </p>
        </div>

        {/* 사용자 정보 카드 */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">사용자명</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.username}</div>
              <p className="text-xs text-muted-foreground">
                로그인 중인 계정
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">이메일</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.email}</div>
              <p className="text-xs text-muted-foreground">
                등록된 이메일 주소
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">가입일</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(user.created_at).toLocaleDateString("ko-KR")}
              </div>
              <p className="text-xs text-muted-foreground">
                계정 생성 날짜
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 추가 정보 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>시작하기</CardTitle>
            <CardDescription>
              아래 기능들을 사용하여 애플리케이션을 탐색해보세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2 rounded-lg border p-4">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">프로필 관리</p>
                <p className="text-sm text-muted-foreground">
                  개인 정보를 확인하고 수정할 수 있습니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
