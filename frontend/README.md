# Frontend - Next.js 15

JWT 인증 시스템을 갖춘 Next.js 15 프론트엔드

## 기술 스택

- **Next.js 15** - React 프레임워크 (App Router)
- **TypeScript** - 타입 안전성
- **Tailwind CSS v4** - 유틸리티 기반 스타일링
- **shadcn/ui** - UI 컴포넌트
- **Zustand** - 전역 상태 관리
- **TanStack Query v5** - 서버 상태 관리
- **React Hook Form** - 폼 관리
- **Zod** - 스키마 검증
- **Axios** - HTTP 클라이언트

## 디렉토리 구조

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/              # 인증 페이지
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (protected)/         # 보호된 페이지
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   └── layout.tsx       # AuthGuard 적용
│   │   ├── layout.tsx           # 루트 레이아웃
│   │   ├── providers.tsx        # TanStack Query Provider
│   │   └── globals.css          # Tailwind CSS
│   ├── components/
│   │   ├── auth/                # 인증 컴포넌트
│   │   ├── layout/              # 레이아웃 컴포넌트
│   │   └── ui/                  # shadcn/ui 컴포넌트
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts        # Axios + 토큰 자동 갱신
│   │   │   └── auth.ts          # 인증 API
│   │   ├── hooks/
│   │   │   └── use-auth.ts      # 인증 훅
│   │   ├── stores/
│   │   │   └── auth-store.ts    # Zustand 스토어
│   │   └── schemas/
│   │       └── auth.schema.ts   # Zod 스키마
│   ├── types/
│   │   └── auth.ts              # 타입 정의
│   └── middleware.ts            # 라우트 보호
├── postcss.config.mjs           # Tailwind CSS v4
├── components.json              # shadcn/ui 설정
└── package.json
```

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

## 환경 변수

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 주요 기능

### 인증 플로우

1. **로그인/회원가입**
   - Zod 스키마로 폼 검증
   - API 호출 후 토큰 저장 (Zustand + localStorage)

2. **토큰 자동 갱신**
   - Axios 인터셉터에서 401 에러 감지
   - Refresh Token으로 자동 갱신
   - 갱신 실패 시 로그아웃

3. **라우트 보호**
   - `middleware.ts`: 서버 사이드 보호
   - `AuthGuard`: 클라이언트 사이드 보호

### 페이지

| 경로 | 설명 | 인증 |
|------|------|------|
| `/` | 홈 | - |
| `/login` | 로그인 | 비인증만 |
| `/register` | 회원가입 | 비인증만 |
| `/dashboard` | 대시보드 | 필요 |
| `/profile` | 프로필 | 필요 |

## shadcn/ui 컴포넌트 추가

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
# ...
```
