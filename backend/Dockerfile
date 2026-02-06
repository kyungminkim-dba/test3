# FastAPI 백엔드 Dockerfile (uv 패키지 매니저 사용)
FROM python:3.12-slim

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 의존성 설치
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    curl \
    && rm -rf /var/lib/apt/lists/*

# uv 설치
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# 의존성 파일 복사
COPY pyproject.toml .
COPY uv.lock* ./

# 의존성 설치 (캐시 활용을 위해 코드 복사 전에 실행)
RUN uv sync --frozen --no-dev --no-install-project || uv sync --no-dev --no-install-project

# 애플리케이션 코드 복사
COPY . .

# 프로젝트 설치
RUN uv sync --frozen --no-dev || uv sync --no-dev

# 포트 노출
EXPOSE 8000

# uv run을 통해 애플리케이션 실행
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
