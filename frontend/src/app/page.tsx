import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white dark:from-black dark:to-zinc-900">
      {/* 네비게이션 바 */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* 로고 */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-lg font-bold">N</span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              Next Starter
            </span>
          </Link>

          {/* 로그인 / 회원가입 버튼 */}
          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                로그인
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">회원가입</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-12 text-center px-6 py-32">
        {/* 앱 타이틀 섹션 */}
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-5xl font-bold tracking-tight text-black dark:text-white sm:text-6xl">
            나의 애플리케이션
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
            현대적인 기술 스택으로 구축된 프리미엄 애플리케이션입니다.
            <br />
            Next.js, FastAPI, MySQL을 활용하여 강력한 기능을 제공합니다.
          </p>
        </div>

        {/* 버튼 섹션 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto">
              로그인
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              회원가입
            </Button>
          </Link>
        </div>

        {/* 기능 설명 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl">
          <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <h3 className="font-semibold text-lg text-black dark:text-white mb-2">
              안전한 인증
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              JWT 기반의 안전한 인증 시스템으로 사용자 정보를 보호합니다.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <h3 className="font-semibold text-lg text-black dark:text-white mb-2">
              고성능 API
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              FastAPI로 구축된 빠르고 신뢰할 수 있는 백엔드 서비스입니다.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <h3 className="font-semibold text-lg text-black dark:text-white mb-2">
              현대적 UI
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              shadcn/ui와 Tailwind CSS로 만들어진 세련된 사용자 인터페이스입니다.
            </p>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t bg-background/95">
        <div className="container flex flex-col items-center gap-2 py-6 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Next Starter. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Next.js &middot; FastAPI &middot; MySQL
          </p>
        </div>
      </footer>
    </div>
  );
}
