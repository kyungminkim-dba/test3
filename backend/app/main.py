"""
FastAPI 메인 애플리케이션
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.database import close_db, init_db
from app.core.vault import load_secrets_to_settings

# 로깅 설정
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    애플리케이션 생명주기 관리

    시작 시:
    - Vault에서 시크릿 로드
    - 데이터베이스 테이블 생성 (개발 환경)

    종료 시:
    - 데이터베이스 연결 종료
    """
    # 시작
    logger.info("애플리케이션 시작 중...")

    # Vault에서 시크릿 로드
    try:
        load_secrets_to_settings()
        logger.info("Vault 시크릿 로드 완료")
    except Exception as e:
        logger.warning(f"Vault 시크릿 로드 실패 (환경 변수 사용): {e}")

    # JWT Secret Key 확인
    if not settings.JWT_SECRET_KEY:
        logger.warning("JWT_SECRET_KEY가 설정되지 않았습니다. 기본값을 사용합니다.")
        settings.JWT_SECRET_KEY = "dev-secret-key-change-in-production"

    # 개발 환경에서 테이블 자동 생성
    if settings.DEBUG:
        try:
            await init_db()
            logger.info("데이터베이스 테이블 초기화 완료")
        except Exception as e:
            logger.error(f"데이터베이스 초기화 실패: {e}")

    logger.info("애플리케이션 시작 완료")

    yield

    # 종료
    logger.info("애플리케이션 종료 중...")
    await close_db()
    logger.info("애플리케이션 종료 완료")


# FastAPI 앱 생성
app = FastAPI(
    title=settings.APP_NAME,
    description="JWT 인증 시스템이 포함된 FastAPI 백엔드",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API 라우터 등록
app.include_router(api_router)


@app.get("/", tags=["헬스체크"])
async def root():
    """루트 엔드포인트"""
    return {"message": "FastAPI 서버가 정상 작동 중입니다."}


@app.get("/health", tags=["헬스체크"])
async def health_check():
    """헬스 체크 엔드포인트"""
    return {"status": "healthy"}
