# Next.js 15 + FastAPI Starter Kit

JWT 인증 시스템과 대시보드를 갖춘 풀스택 웹 애플리케이션 Starter Kit

---

## 기술 스택

### Frontend
| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js | 15+ | React 프레임워크 (App Router) |
| TypeScript | 5+ | 타입 안전성 |
| Tailwind CSS | v4 | 유틸리티 기반 스타일링 |
| shadcn/ui | - | UI 컴포넌트 |
| Zustand | 5+ | 전역 상태 관리 |
| TanStack Query | v5 | 서버 상태 관리 |
| React Hook Form | - | 폼 관리 |
| Zod | - | 스키마 검증 |

### Backend
| 기술 | 버전 | 용도 |
|------|------|------|
| FastAPI | 0.115+ | 비동기 API 프레임워크 |
| SQLModel | 0.0.22+ | ORM (Pydantic v2 지원) |
| Alembic | 1.13+ | DB 마이그레이션 |
| PyJWT | 2.9+ | JWT 토큰 처리 |
| pwdlib[argon2] | 0.2+ | 비밀번호 해싱 |
| asyncmy | 0.2.9+ | MySQL 비동기 드라이버 |

### Infrastructure
| 기술 | 용도 |
|------|------|
| Docker Compose | 컨테이너 오케스트레이션 |
| MySQL 8.0 | 관계형 데이터베이스 |
| HashiCorp Vault | 시크릿 관리 (JWT Key, DB 비밀번호) |

---

## 주요 기능

- **JWT 인증 시스템**
  - Access Token (30분) + Refresh Token (7일)
  - Refresh Token 로테이션 (사용 시 자동 무효화)
  - 자동 토큰 갱신 (Axios 인터셉터)

- **사용자 관리**
  - 회원가입 / 로그인 / 로그아웃
  - 프로필 조회 및 수정
  - Argon2id 비밀번호 해싱

- **보안**
  - Vault를 통한 시크릿 관리
  - CORS 설정
  - 라우트 보호 (미들웨어 + AuthGuard)

---

## 로컬 개발 환경 설정

### 1. 사전 요구사항

- Docker Desktop
- Node.js 18.17+
- Python 3.12+ (로컬 개발 시)

### 2. 설치 및 실행

```bash
# 1. 저장소 클론
git clone <repository-url>
cd claude-nextjs-starterkit

# 2. 환경 변수 설정
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 3. Docker Compose 실행
docker-compose up -d

# 4. Vault 초기화 (최초 1회)
chmod +x scripts/init-vault.sh
./scripts/init-vault.sh

# 5. FastAPI 재시작 (Vault 시크릿 로드)
docker restart fastapi-backend

# 6. Frontend 실행
cd frontend
npm install
npm run dev
```

### 3. 접속 URL

| 서비스 | URL | 비고 |
|--------|-----|------|
| Frontend | http://localhost:3000 | Next.js 개발 서버 |
| Backend API | http://localhost:8000 | FastAPI |
| Swagger Docs | http://localhost:8000/docs | API 문서 |
| Vault UI | http://localhost:8200 | 토큰: `dev-root-token` |

---

## API 엔드포인트

### 인증 (Auth)

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | `/api/v1/auth/register` | 회원가입 | - |
| POST | `/api/v1/auth/login` | 로그인 | - |
| POST | `/api/v1/auth/refresh` | 토큰 갱신 | - |
| POST | `/api/v1/auth/logout` | 로그아웃 | Bearer |

### 사용자 (Users)

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | `/api/v1/users/me` | 내 프로필 조회 | Bearer |
| PUT | `/api/v1/users/me` | 프로필 수정 | Bearer |
| DELETE | `/api/v1/users/me` | 계정 삭제 | Bearer |

---

## 프로젝트 구조

```
claude-nextjs-starterkit/
├── frontend/                      # Next.js 15 프로젝트
│   ├── src/
│   │   ├── app/                   # App Router 페이지
│   │   │   ├── (auth)/            # 인증 페이지 (login, register)
│   │   │   ├── (protected)/       # 보호된 페이지 (dashboard, profile)
│   │   │   └── providers.tsx      # TanStack Query Provider
│   │   ├── components/
│   │   │   ├── auth/              # 인증 컴포넌트
│   │   │   ├── layout/            # 레이아웃 컴포넌트
│   │   │   └── ui/                # shadcn/ui 컴포넌트
│   │   ├── lib/
│   │   │   ├── api/               # API 클라이언트
│   │   │   ├── hooks/             # 커스텀 훅
│   │   │   ├── stores/            # Zustand 스토어
│   │   │   └── schemas/           # Zod 스키마
│   │   └── middleware.ts          # 라우트 보호
│   └── package.json
├── backend/                       # FastAPI 프로젝트
│   ├── app/
│   │   ├── core/                  # 핵심 설정
│   │   │   ├── config.py          # 환경 변수
│   │   │   ├── security.py        # JWT + Argon2
│   │   │   ├── database.py        # DB 연결
│   │   │   └── vault.py           # Vault 클라이언트
│   │   ├── models/                # SQLModel 모델
│   │   ├── schemas/               # Pydantic 스키마
│   │   ├── crud/                  # CRUD 로직
│   │   ├── api/v1/                # API 라우터
│   │   └── main.py                # 앱 진입점
│   ├── alembic/                   # DB 마이그레이션
│   └── pyproject.toml             # Python 의존성
├── scripts/
│   └── init-vault.sh              # Vault 초기화
├── docker-compose.yml
└── README.md
```

---

## 환경 변수

### Backend (`backend/.env`)

```env
# Database
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=starterkit_db

# Vault
VAULT_ADDR=http://vault:8200
VAULT_TOKEN=dev-root-token

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 보안 주의사항

1. **환경 변수 파일**
   - `.env`, `.env.local` 파일은 절대 Git에 커밋하지 마세요
   - `.gitignore`에 이미 포함되어 있습니다

2. **Vault 토큰**
   - 개발 환경에서는 `dev-root-token` 사용
   - 운영 환경에서는 별도 인증 방식 (AppRole, Kubernetes 등) 사용

3. **JWT Secret Key**
   - Vault에서 자동 생성 (32바이트 이상)
   - 운영 환경에서는 별도로 안전하게 관리

4. **HTTPS**
   - 운영 환경에서는 반드시 HTTPS 사용

---

## 트러블슈팅

### Vault 연결 실패

```bash
# Vault 상태 확인
docker logs vault

# Vault 재초기화
docker-compose down -v
docker-compose up -d
./scripts/init-vault.sh
docker restart fastapi-backend
```

### MySQL 연결 실패

```bash
# MySQL 상태 확인
docker logs mysql

# MySQL 컨테이너 재시작
docker restart mysql
```

### JWT 토큰 무효화

Vault 재초기화 시 JWT Secret Key가 변경되어 기존 토큰이 무효화됩니다.
다시 로그인하여 새 토큰을 발급받으세요.

### Frontend 빌드 오류

```bash
# node_modules 삭제 후 재설치
cd frontend
rm -rf node_modules .next
npm install
npm run dev
```

---

## 다음 단계 (선택적 확장)

- [ ] 이메일 인증
- [ ] 비밀번호 재설정
- [ ] OAuth 2.0 (Google, GitHub)
- [ ] Role-Based Access Control (RBAC)
- [ ] API Rate Limiting
- [ ] Logging & Monitoring (Sentry)

---

## 라이선스

MIT License
