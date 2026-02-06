/**
 * 헤더 컴포넌트
 * - 로고, 네비게이션 메뉴 표시
 * - 로그아웃 버튼
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { user, logout, isLoggingOut } = useAuth();

  const navItems = [
    {
      href: "/dashboard",
      label: "대시보드",
      icon: LayoutDashboard,
    },
    {
      href: "/profile",
      label: "프로필",
      icon: User,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* 로고 */}
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-lg font-bold">N</span>
          </div>
          <span className="hidden font-bold sm:inline-block">
            Next Starter
          </span>
        </Link>

        {/* 네비게이션 */}
        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline-block">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 우측 영역 */}
        <div className="ml-auto flex items-center space-x-4">
          {/* 사용자 정보 */}
          {user && (
            <div className="hidden text-sm text-muted-foreground md:block">
              <span className="font-medium text-foreground">
                {user.username}
              </span>
              님
            </div>
          )}

          {/* 로그아웃 버튼 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            disabled={isLoggingOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </Button>
        </div>
      </div>
    </header>
  );
}
