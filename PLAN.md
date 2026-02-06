# Next.js 15 + FastAPI Starter Kit 구현 계획

---

## 🚀 진행 상황 (2026-02-04 업데이트)

| Phase | 작업 | 상태 | 완료일 |
|-------|------|------|--------|
| **Phase 1** | Infrastructure 설정 | ✅ 완료 | 2026-02-04 |
| **Phase 2** | Backend 구현 | ✅ 완료 | 2026-02-04 |
| **Phase 3** | Frontend 구현 | ✅ 완료 | 2026-02-04 |
| **Phase 4** | 통합 및 테스트 | ✅ 완료 | 2026-02-04 |
| **Phase 5** | 문서화 | ✅ 완료 | 2026-02-04 |

### ✅ 모든 Phase 완료!

### 완료된 작업 상세

**Phase 1 - Infrastructure:**
- [x] docker-compose.yml (MySQL, Vault, FastAPI)
- [x] scripts/init-vault.sh (JWT, DB 시크릿)
- [x] backend/.env, frontend/.env.local

**Phase 2 - Backend:**
- [x] core/ (config, security, database, vault)
- [x] models/user.py (User, RefreshToken)
- [x] schemas/ (auth, user)
- [x] crud/user.py
- [x] api/v1/ (auth, users)
- [x] Alembic 마이그레이션
- [x] API 테스트 완료 (회원가입, 로그인, 프로필, 토큰갱신)

**Phase 3 - Frontend:**
- [x] Next.js 15 + Tailwind v4 + shadcn/ui 초기화
- [x] API 클라이언트 (Axios + 토큰 자동 갱신)
- [x] Zustand 인증 스토어
- [x] TanStack Query 설정
- [x] Zod 스키마 + React Hook Form
- [x] 로그인/회원가입 폼
- [x] 미들웨어 + AuthGuard
- [x] 대시보드/프로필 페이지
- [x] 빌드 성공 확인

**Phase 4 - 통합 및 테스트:** (2026-02-04 19:23~19:27)
- [x] Docker Compose 실행 (MySQL, Vault, FastAPI 컨테이너)
- [x] Vault 초기화 (JWT Secret, DB 시크릿 저장)
- [x] FastAPI 재시작 후 Vault 시크릿 로드 확인
- [x] Alembic 마이그레이션 stamp (테이블 이미 존재)
- [x] API 테스트:
  - 회원가입: POST /api/v1/auth/register → 토큰 발급 ✅
  - 로그인: POST /api/v1/auth/login → Access/Refresh Token ✅
  - 프로필 조회: GET /api/v1/users/me → JWT 인증 ✅
  - 프로필 업데이트: PUT /api/v1/users/me → 정상 반영 ✅
  - Refresh Token 갱신: POST /api/v1/auth/refresh → 로테이션 동작 ✅
  - 로그아웃: POST /api/v1/auth/logout → HTTP 204 ✅
  - 잘못된 비밀번호: 401 Unauthorized ✅
- [x] Frontend 테스트:
  - 로그인/회원가입 페이지: HTTP 200 ✅
  - 대시보드/프로필 페이지: HTTP 307 (미인증 시 리디렉트) ✅
- [x] 보안 체크리스트:
  - Vault JWT 시크릿 연동: "Vault에서 JWT 시크릿 로드 완료" ✅
  - Argon2id 비밀번호 해싱: `$argon2id$v=19$m=65536,t=3,p=4$...` ✅
  - Refresh Token DB 저장: 11개 토큰 저장됨 ✅
  - CORS 설정: `access-control-allow-origin: http://localhost:3000` ✅

**Phase 5 - 문서화:** (2026-02-04)
- [x] README.md 작성 (프로젝트 루트)
  - 기술 스택, 주요 기능, 설치 방법
  - API 엔드포인트, 프로젝트 구조
  - 환경 변수, 보안 주의사항, 트러블슈팅
- [x] backend/README.md 작성
- [x] frontend/README.md 업데이트
- [x] .gitignore 확인 (이미 완료)

**버그 수정:** (2026-02-04)
- [x] 회원가입 링크 404 오류 수정
  - 문제: 홈페이지 회원가입 버튼이 `/signup`으로 연결 (존재하지 않는 경로)
  - 해결: `frontend/src/app/page.tsx`에서 `/register`로 수정
- [x] 로그인 후 대시보드 리디렉션 안 되는 문제 수정
  - 문제: 로그인 성공 메시지는 나오지만 `/dashboard`로 이동 안 됨
  - 원인: 미들웨어에서 `auth-token` 쿠키를 확인하는데, Zustand 스토어에서 쿠키 미설정
  - 해결: `frontend/src/lib/stores/auth-store.ts`에 쿠키 설정/삭제 로직 추가
    - `setAuth()`: 로그인 시 `auth-token` 쿠키 설정
    - `setAccessToken()`: 토큰 갱신 시 쿠키 업데이트
    - `logout()`: 로그아웃 시 쿠키 삭제

### 현재 접속 URL
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs
- **Vault UI**: http://localhost:8200 (토큰: dev-root-token)

### 실행 방법 (이어서 작업 시)
```bash
# 1. Docker 컨테이너 시작
cd claude-nextjs-starterkit
docker-compose up -d

# 2. Vault 초기화 (최초 1회 또는 볼륨 삭제 후)
./scripts/init-vault.sh

# 3. Frontend 개발 서버
cd frontend
npm run dev
```

---

## 프로젝트 개요

완전한 JWT 인증 시스템과 대시보드를 갖춘 웹 개발 Starter Kit 구축

**기술 스택:** (2026년 2월 공식 문서 기준 검토 완료)
- Frontend: Next.js 15, TypeScript, Tailwind CSS v4, shadcn/ui, Zustand, TanStack Query v5, React Hook Form + Zod
- Backend: FastAPI, MySQL, SQLModel + Alembic, PyJWT, pwdlib[argon2], asyncmy, HashiCorp Vault
- Infrastructure: Docker Compose

**⚠️ 기술 스택 변경 사항 (공식 문서 검토 결과):**
| 영역 | 변경 전 | 변경 후 | 이유 |
|-----|--------|--------|------|
| JWT | python-jose | **PyJWT** | 유지보수 중단, Python 3.10+ 호환 불가 |
| 비밀번호 해싱 | passlib | **pwdlib** | Python 3.13+ 호환 불가 |
| MySQL 드라이버 | aiomysql | **asyncmy** | 22-28% 성능 향상 |
| Tailwind CSS | - | **@tailwindcss/postcss 추가** | v4 필수 의존성, postcss.config.js 필요 |
| shadcn/ui (npm) | - | **--legacy-peer-deps 필요할 수 있음** | React 19 peer dependency 문제 |

**선택된 옵션:**
- 완전한 인증 시스템 (로그인, 회원가입, 프로필, refresh token)
- 별도 디렉토리 구조 (frontend/, backend/)
- Docker Compose + Vault 초기화 스크립트 포함
- 상세한 README 문서

---

## 디렉토리 구조

```
claude-nextjs-starterkit/
├── frontend/                      # Next.js 15 프로젝트
│   ├── src/                       # 소스 디렉토리 (--src-dir 옵션)
│   │   ├── app/
│   │   │   ├── (auth)/           # 인증 페이지 그룹
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── register/
│   │   │   │       └── page.tsx
│   │   │   ├── (protected)/      # 보호된 페이지 그룹
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── profile/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── providers.tsx     # TanStack Query Provider
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── login-form.tsx
│   │   │   │   ├── register-form.tsx
│   │   │   │   └── auth-guard.tsx
│   │   │   ├── layout/
│   │   │   │   └── header.tsx
│   │   │   └── ui/               # shadcn/ui 컴포넌트
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── form.tsx
│   │   │       ├── input.tsx
│   │   │       ├── label.tsx
│   │   │       ├── separator.tsx
│   │   │       └── sonner.tsx    # 토스트 알림
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   │   ├── client.ts     # Axios + 토큰 갱신
│   │   │   │   └── auth.ts
│   │   │   ├── hooks/
│   │   │   │   └── use-auth.ts
│   │   │   ├── stores/
│   │   │   │   └── auth-store.ts # Zustand
│   │   │   ├── schemas/
│   │   │   │   └── auth.schema.ts # Zod
│   │   │   ├── query-client.ts
│   │   │   └── utils.ts
│   │   ├── types/
│   │   │   └── auth.ts
│   │   └── middleware.ts          # Next.js 미들웨어
│   ├── postcss.config.mjs         # Tailwind CSS v4 설정
│   ├── .env.local
│   ├── .env.example
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── components.json
│   └── package.json
├── backend/                       # FastAPI 프로젝트
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py         # Pydantic Settings
│   │   │   ├── security.py       # JWT + Argon2 (PyJWT, pwdlib)
│   │   │   ├── database.py       # SQLModel 비동기 세션 (asyncmy)
│   │   │   └── vault.py          # Vault 클라이언트
│   │   ├── models/
│   │   │   └── user.py           # User, RefreshToken
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   └── auth.py
│   │   ├── crud/
│   │   │   └── user.py
│   │   ├── api/
│   │   │   ├── deps.py           # get_current_user
│   │   │   └── v1/
│   │   │       ├── auth.py       # 로그인, 회원가입, refresh, logout
│   │   │       ├── users.py      # 프로필 CRUD
│   │   │       └── api.py
│   │   └── main.py
│   ├── alembic/
│   │   ├── versions/
│   │   │   └── 20260204_000000_001_initial_migration.py
│   │   └── env.py
│   ├── .venv/                     # Python 가상환경 (uv)
│   ├── alembic.ini
│   ├── pyproject.toml             # 의존성 관리 (uv 패키지 매니저)
│   ├── Dockerfile
│   ├── .env
│   └── .env.example
├── scripts/
│   └── init-vault.sh              # Vault 시크릿 초기화
├── docker-compose.yml
├── .gitignore
├── PLAN.md                        # 이 파일
└── CLAUDE.md
```

---

## 구현 단계

### Phase 1: Infrastructure 설정 (30분-1시간)

**1.1 Docker Compose 구성**
- HashiCorp Vault dev 모드 (포트 8200)
- FastAPI 컨테이너 (포트 8000)
- 볼륨: vault_data
- MySQL은 기존 Docker 인프라 사용 (127.0.0.1:3306)

**1.2 Vault 초기화 스크립트**
```bash
# scripts/init-vault.sh
vault kv put secret/app/config \
  JWT_SECRET_KEY="$(openssl rand -hex 32)"
```

**1.3 환경 변수 설정**
- backend/.env: MySQL 호스트 127.0.0.1, Vault, JWT 설정
- frontend/.env.local: NEXT_PUBLIC_API_URL

**파일:**
- docker-compose.yml (Vault + FastAPI만)
- scripts/init-vault.sh
- backend/.env.example (MYSQL_HOST=127.0.0.1)
- frontend/.env.example

---

### Phase 2: Backend 구현 (4-6시간)

**2.1 핵심 설정 파일**

**backend/pyproject.toml** (uv 패키지 매니저 사용)
```toml
[project]
name = "claude-nextjs-starterkit-backend"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    # Web Framework
    "fastapi[standard]>=0.115.0",    # uvicorn 포함

    # Database ORM & Migrations
    "sqlmodel>=0.0.22",              # Pydantic v2 완전 지원
    "alembic>=1.13.0",
    "asyncmy>=0.2.9",                # ✅ aiomysql → asyncmy (22-28% 성능 향상)
    "pymysql>=1.1.0",                # Alembic 동기 드라이버

    # Authentication & Security
    "PyJWT>=2.9.0",                  # ✅ python-jose → PyJWT (유지보수 활발)
    "pwdlib[argon2]>=0.2.0",         # ✅ passlib → pwdlib (Python 3.13+ 호환)

    # Vault Client
    "hvac>=2.3.0",

    # Configuration
    "pydantic-settings>=2.5.0",
]
```

**backend/app/core/config.py**
- Pydantic BaseSettings로 환경 변수 관리
- MySQL 연결 URL (비동기: asyncmy, 동기: mysqlconnector)
- JWT 설정 (SECRET_KEY, ALGORITHM, 만료 시간)

**backend/app/core/security.py**
- `create_access_token()`: 15-30분 만료 (PyJWT 사용)
- `create_refresh_token()`: 7일 만료 (PyJWT 사용)
- `decode_token()`: JWT 검증 (PyJWT 사용)
- `get_password_hash()`: Argon2 해싱 (pwdlib 사용)
- `verify_password()`: 비밀번호 검증 (pwdlib 사용)

**backend/app/core/database.py**
- `create_async_engine()`: MySQL 비동기 엔진 (asyncmy 드라이버)
- `get_async_session()`: 세션 의존성
- `init_db()`: 테이블 생성 (개발 전용)

**backend/app/core/vault.py**
- `VaultClient` 클래스
- `get_secret()`: KV v2 시크릿 조회
- `load_secrets_to_settings()`: 런타임에 Vault 시크릿 로드

**2.2 데이터 모델**

**backend/app/models/user.py**
```python
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    username: str = Field(unique=True, index=True)
    hashed_password: str
    full_name: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class RefreshToken(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    token_hash: str = Field(unique=True, index=True)
    expires_at: datetime
    is_revoked: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

**2.3 Pydantic 스키마**

**backend/app/schemas/user.py**
- `UserCreate`: 회원가입 요청
- `UserRead`: 사용자 응답
- `UserUpdate`: 프로필 업데이트

**backend/app/schemas/auth.py**
- `LoginRequest`: 로그인 요청
- `Token`: 토큰 응답 (access_token, refresh_token)
- `RefreshTokenRequest`: refresh token 요청

**2.4 CRUD 로직**

**backend/app/crud/user.py**
- `create_user()`: Argon2로 비밀번호 해싱 후 저장
- `get_user_by_email()`: 이메일로 조회
- `authenticate_user()`: 로그인 검증
- `save_refresh_token()`: Refresh Token 해시값 저장
- `verify_refresh_token()`: Refresh Token DB 검증
- `revoke_refresh_token()`: 토큰 무효화

**2.5 API 엔드포인트**

**backend/app/api/deps.py**
- `get_current_user()`: JWT 토큰 검증 및 사용자 조회
- HTTPBearer로 Authorization 헤더 검증

**backend/app/api/v1/auth.py**
- `POST /api/v1/auth/register`: 이메일 중복 확인 후 회원가입
- `POST /api/v1/auth/login`: Access Token + Refresh Token 발급
- `POST /api/v1/auth/refresh`: Refresh Token 로테이션 (기존 토큰 무효화 + 새 토큰 발급)
- `POST /api/v1/auth/logout`: 로그아웃 (모든 Refresh Token 무효화)

**backend/app/api/v1/users.py**
- `GET /api/v1/users/me`: 현재 사용자 정보
- `PUT /api/v1/users/me`: 프로필 업데이트
- `DELETE /api/v1/users/me`: 계정 삭제 (soft delete)

**backend/app/main.py**
- CORS 설정 (BACKEND_CORS_ORIGINS)
- Lifespan 이벤트에서 Vault 시크릿 로드
- API 라우터 등록

**2.6 Alembic 마이그레이션**

```bash
# 초기화
alembic init alembic

# alembic/env.py 수정
# - sys.path 설정
# - Vault 시크릿 로드
# - target_metadata = SQLModel.metadata

# 마이그레이션 생성
alembic revision --autogenerate -m "Initial migration"

# 적용
alembic upgrade head
```

**주요 파일:**
- backend/app/core/config.py
- backend/app/core/security.py
- backend/app/core/database.py
- backend/app/core/vault.py
- backend/app/models/user.py
- backend/app/crud/user.py
- backend/app/api/v1/auth.py
- backend/app/api/deps.py
- backend/app/main.py
- backend/alembic/env.py

---

### Phase 3: Frontend 구현 (5-7시간)

**3.1 프로젝트 초기화**

```bash
cd frontend

# 1. Next.js 15 프로젝트 생성
npx create-next-app@latest . --typescript --tailwind --app

# 2. Tailwind CSS v4 추가 설정 (필수!)
npm install @tailwindcss/postcss

# 3. 상태 관리 및 데이터 페칭
npm install zustand axios @tanstack/react-query @tanstack/react-query-devtools

# 4. 폼 검증
npm install react-hook-form @hookform/resolvers zod

# 5. UI 컴포넌트
npx shadcn@latest init -d
npx shadcn@latest add button input label card form sonner -y
```

> **참고:** toast 컴포넌트는 deprecated되어 sonner 사용

**3.2 Tailwind CSS v4 설정**

**frontend/postcss.config.mjs** (Next.js 15 기본 생성)
```javascript
const config = {
  plugins: ["@tailwindcss/postcss"],
};
export default config;
```

**frontend/src/app/globals.css**
```css
@import "tailwindcss";

/* shadcn/ui 테마 변수 (자동 생성됨) */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    /* ... 기타 변수 */
  }
}
```

**3.3 API 클라이언트**

**frontend/src/lib/api/client.ts**
- Axios 인스턴스 생성
- Request 인터셉터: Access Token 자동 추가
- Response 인터셉터: 401 에러 시 Refresh Token 자동 갱신
  - 갱신 중 중복 요청 방지 (Queue 패턴)
  - 갱신 실패 시 로그아웃 후 /login 리디렉트

**frontend/src/lib/api/auth.ts**
```typescript
export const authApi = {
  login: (data) => apiClient.post('/auth/login', data),
  register: (data) => apiClient.post('/auth/register', data),
  logout: () => apiClient.post('/auth/logout'),
  getCurrentUser: () => apiClient.get('/auth/me'),
};
```

**3.4 Zustand 인증 스토어**

**frontend/src/lib/stores/auth-store.ts**
```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user, accessToken, refreshToken) => void;
  setAccessToken: (token) => void;
  logout: () => void;
}

// persist 미들웨어로 localStorage 저장
// accessToken은 메모리만 (XSS 방어)
// refreshToken은 persist (새로고침 시 재로그인 방지)
```

**3.5 TanStack Query 설정**

**frontend/src/lib/query-client.ts**
- SSR 호환 QueryClient 싱글톤 패턴
- staleTime: 60초, gcTime: 5분

**frontend/src/app/providers.tsx**
```typescript
'use client';
export function Providers({ children }) {
  const [queryClient] = useState(() => getQueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" richColors closeButton />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
```

**frontend/src/app/layout.tsx**
- Providers로 래핑
- Geist 폰트 설정

**3.6 Zod 스키마**

**frontend/src/lib/schemas/auth.schema.ts**
```typescript
export const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상'),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword);
```

**3.7 커스텀 훅**

**frontend/src/lib/hooks/use-auth.ts**
```typescript
export const useAuth = () => {
  const { setAuth, logout: logoutStore } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      setAuth(response.user, response.access_token, response.refresh_token);
      router.push('/dashboard');
    },
  });

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
  };
};
```

**3.8 인증 UI 컴포넌트**

**frontend/src/components/auth/login-form.tsx**
- React Hook Form + zodResolver
- shadcn/ui Form 컴포넌트
- useAuth 훅 사용

**frontend/src/app/(auth)/login/page.tsx**
- LoginForm 렌더링
- 중앙 정렬 레이아웃

**frontend/src/components/auth/register-form.tsx**
- 회원가입 폼 (로그인과 동일한 패턴)

**3.9 라우트 보호**

**frontend/src/middleware.ts**
```typescript
export function middleware(request: NextRequest) {
  const protectedRoutes = ['/dashboard', '/profile'];
  const authRoutes = ['/login', '/register'];

  const token = request.cookies.get('auth-token')?.value;

  // 보호된 라우트: 토큰 없으면 /login으로
  // 인증 페이지: 토큰 있으면 /dashboard로
}
```

**frontend/src/components/auth/auth-guard.tsx**
- 클라이언트 측 가드
- useEffect로 isAuthenticated 확인
- 미인증 시 /login으로 리디렉트

**3.10 보호된 페이지**

**frontend/src/app/(protected)/layout.tsx**
- AuthGuard로 래핑
- Header 포함

**frontend/src/app/(protected)/dashboard/page.tsx**
- 대시보드 페이지
- 사용자 환영 메시지

**frontend/src/app/(protected)/profile/page.tsx**
- 프로필 페이지
- useCurrentUser로 사용자 정보 조회
- 프로필 업데이트 폼
- 계정 삭제 기능

**주요 파일:**
- frontend/src/lib/api/client.ts
- frontend/src/lib/stores/auth-store.ts
- frontend/src/lib/query-client.ts
- frontend/src/app/providers.tsx
- frontend/src/lib/schemas/auth.schema.ts
- frontend/src/lib/hooks/use-auth.ts
- frontend/src/components/auth/login-form.tsx
- frontend/src/middleware.ts
- frontend/src/app/(protected)/layout.tsx

---

### Phase 4: 통합 및 테스트 (2-3시간)

**4.1 Docker Compose 실행**
```bash
docker-compose up -d
```

**4.2 Vault 초기화**
```bash
chmod +x scripts/init-vault.sh
docker exec -it auth_vault sh /vault/init-vault.sh
```

**4.3 DB 마이그레이션**
```bash
docker exec -it auth_fastapi alembic upgrade head
```

**4.4 테스트 시나리오**
1. 회원가입: POST /api/v1/auth/register
2. 로그인: POST /api/v1/auth/login → Access Token 받기
3. 프로필 조회: GET /api/v1/users/me (Authorization 헤더)
4. 프로필 업데이트: PUT /api/v1/users/me
5. Refresh Token 갱신: POST /api/v1/auth/refresh

**4.5 Frontend 테스트**
```bash
cd frontend
npm run dev
```
1. http://localhost:3000 접속
2. 회원가입 → 로그인 → 대시보드 접근
3. 프로필 페이지에서 정보 업데이트
4. 로그아웃 후 보호된 페이지 접근 차단 확인

**4.6 보안 체크리스트**
- [ ] JWT_SECRET_KEY는 Vault에서 조회
- [ ] 비밀번호는 Argon2로 해싱
- [ ] Refresh Token 로테이션 동작 확인
- [ ] CORS 설정 확인
- [ ] Access Token 만료 시 자동 갱신 확인

---

### Phase 5: 문서화 (1-2시간)

**5.1 README.md 구조**

```markdown
# Next.js 15 + FastAPI Starter Kit

## 기술 스택
[프론트엔드, 백엔드, 인프라 목록]

## 로컬 개발 환경 설정

### 1. 사전 요구사항
- Docker Desktop
- Node.js 18.17+
- Python 3.11+

### 2. 설치
\`\`\`bash
# 1. 환경 변수 설정
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 2. Docker Compose 실행
docker-compose up -d

# 3. Vault 초기화
chmod +x scripts/init-vault.sh
docker exec -it auth_vault sh /vault/init-vault.sh

# 4. DB 마이그레이션
docker exec -it auth_fastapi alembic upgrade head

# 5. Frontend 실행 (로컬)
cd frontend
npm install
npm run dev
\`\`\`

### 3. 접속 URL
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs
- Vault UI: http://localhost:8200 (토큰: root)

## API 엔드포인트
[인증, 사용자 API 목록]

## 프로젝트 구조
[디렉토리 설명]

## 보안 주의사항
1. .env 파일은 Git에 커밋 금지
2. 운영 환경에서는 Vault의 다른 인증 방식 사용
3. JWT_SECRET_KEY는 32바이트 이상
4. HTTPS 필수 (운영)

## 트러블슈팅
[Vault 연결 실패, MySQL 연결 실패 등]
```

**5.2 코드 주석**
- 각 핵심 파일에 한국어 주석 추가
- 복잡한 로직 (Refresh Token 갱신, Middleware 등)에 상세 설명

**5.3 .gitignore 확인**
```gitignore
# 환경 변수
.env
.env.local

# 데이터베이스
*.db

# Docker
volumes/

# Python
__pycache__/
venv/

# Node.js
node_modules/
.next/
```

---

## 중요 파일 요약

### Backend (FastAPI)
1. **backend/app/core/security.py** - JWT 토큰 생성/검증 (PyJWT), Argon2 해싱 (pwdlib)
2. **backend/app/api/v1/auth.py** - 회원가입, 로그인, refresh 엔드포인트
3. **backend/app/crud/user.py** - 사용자 CRUD 및 Refresh Token 관리
4. **backend/app/core/config.py** - 환경 변수 및 Vault 연동
5. **backend/app/core/database.py** - MySQL 비동기 연결 (asyncmy 드라이버)
6. **docker-compose.yml** - Vault, FastAPI 오케스트레이션

### Frontend (Next.js)
1. **frontend/src/lib/api/client.ts** - Axios 클라이언트 + 자동 토큰 갱신
2. **frontend/src/lib/stores/auth-store.ts** - Zustand 인증 스토어 (persist)
3. **frontend/src/app/providers.tsx** - TanStack Query Provider
4. **frontend/src/middleware.ts** - Next.js 미들웨어 (라우트 보호)
5. **frontend/src/lib/schemas/auth.schema.ts** - Zod 폼 검증 스키마
6. **frontend/postcss.config.mjs** - Tailwind CSS v4 설정

---

## 검증 방법

### 기능 테스트
1. **회원가입 플로우**
   - 이메일 중복 확인
   - 비밀번호 유효성 검증 (프론트/백엔드 모두)
   - 성공 시 자동 로그인

2. **로그인 플로우**
   - 잘못된 이메일/비밀번호 시 에러
   - 성공 시 Access Token + Refresh Token 발급
   - 대시보드로 리디렉트

3. **토큰 갱신**
   - Access Token 만료 시 자동 갱신
   - Refresh Token 로테이션 (기존 토큰 무효화)
   - 갱신 실패 시 로그아웃

4. **라우트 보호**
   - 미인증 시 /dashboard 접근 → /login으로
   - 인증 후 /login 접근 → /dashboard로

5. **프로필 관리**
   - 현재 사용자 정보 조회
   - 프로필 업데이트 (이름, 이메일 등)
   - 계정 삭제 (soft delete)

### 보안 테스트
1. JWT 토큰 검증 (만료, 잘못된 시크릿)
2. SQL Injection 방지 (SQLModel ORM)
3. XSS 방지 (React 자동 이스케이프)
4. CORS 설정 확인

---

## 다음 단계 (선택적 확장)

1. **이메일 인증**
   - 회원가입 시 인증 이메일 발송
   - is_email_verified 필드 추가

2. **비밀번호 재설정**
   - /auth/forgot-password
   - /auth/reset-password

3. **OAuth 2.0 로그인**
   - Google, GitHub 연동

4. **Role-Based Access Control (RBAC)**
   - User, Admin, Moderator 역할
   - 권한별 API 접근 제어

5. **API Rate Limiting**
   - slowapi 라이브러리 사용
   - 로그인 엔드포인트: 분당 5회 제한

6. **Logging 및 Monitoring**
   - 구조화된 로깅 (JSON 포맷)
   - Sentry 연동 (에러 추적)

---

## 예상 소요 시간

- **Phase 1 (Infrastructure)**: 30분-1시간 (MySQL 기존 인프라 사용으로 단축)
- **Phase 2 (Backend)**: 4-6시간
- **Phase 3 (Frontend)**: 5-7시간
- **Phase 4 (통합 및 테스트)**: 2-3시간
- **Phase 5 (문서화)**: 1-2시간

**총 예상 시간: 12-19시간**

---

이 계획은 운영 수준의 JWT 인증 시스템을 갖춘 웹 애플리케이션 Starter Kit을 구축하기 위한 단계별 로드맵입니다. 각 Phase는 독립적으로 완료 가능하며, 순차적으로 진행하면 완전한 풀스택 애플리케이션을 얻을 수 있습니다.
