# Backend - FastAPI

JWT 인증 시스템을 제공하는 FastAPI 백엔드

## 기술 스택

- **FastAPI** - 비동기 웹 프레임워크
- **SQLModel** - ORM (SQLAlchemy + Pydantic)
- **Alembic** - DB 마이그레이션
- **PyJWT** - JWT 토큰 처리
- **pwdlib[argon2]** - 비밀번호 해싱
- **asyncmy** - MySQL 비동기 드라이버
- **hvac** - Vault 클라이언트

## 디렉토리 구조

```
backend/
├── app/
│   ├── core/           # 핵심 설정
│   │   ├── config.py   # Pydantic Settings
│   │   ├── security.py # JWT + Argon2
│   │   ├── database.py # DB 연결
│   │   └── vault.py    # Vault 클라이언트
│   ├── models/         # SQLModel 모델
│   ├── schemas/        # Pydantic 스키마
│   ├── crud/           # CRUD 로직
│   ├── api/
│   │   ├── deps.py     # 의존성 (get_current_user)
│   │   └── v1/         # API 라우터
│   └── main.py         # 앱 진입점
├── alembic/            # 마이그레이션
├── pyproject.toml      # 의존성 (uv)
└── Dockerfile
```

## 로컬 실행 (Docker 없이)

```bash
# 1. 가상환경 생성 (uv 사용)
uv venv
source .venv/bin/activate

# 2. 의존성 설치
uv sync

# 3. 환경 변수 설정
cp .env.example .env
# .env 파일 수정 (MYSQL_HOST=127.0.0.1)

# 4. 마이그레이션
uv run alembic upgrade head

# 5. 서버 실행
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API 문서

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 주요 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/v1/auth/register` | 회원가입 |
| POST | `/api/v1/auth/login` | 로그인 |
| POST | `/api/v1/auth/refresh` | 토큰 갱신 |
| POST | `/api/v1/auth/logout` | 로그아웃 |
| GET | `/api/v1/users/me` | 내 프로필 |
| PUT | `/api/v1/users/me` | 프로필 수정 |
