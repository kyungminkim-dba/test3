"""
데이터베이스 모듈
SQLModel 기반 비동기 MySQL 연결 (asyncmy 드라이버)
"""

from collections.abc import AsyncGenerator
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

from app.core.config import settings

# 지연 초기화를 위한 전역 변수
_async_engine: Optional[AsyncEngine] = None
_async_session_factory: Optional[sessionmaker] = None


def get_async_engine() -> AsyncEngine:
    """비동기 엔진 반환 (지연 초기화)"""
    global _async_engine
    if _async_engine is None:
        _async_engine = create_async_engine(
            settings.async_database_url,
            echo=settings.DEBUG,
            future=True,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20,
        )
    return _async_engine


def get_session_factory() -> sessionmaker:
    """세션 팩토리 반환 (지연 초기화)"""
    global _async_session_factory
    if _async_session_factory is None:
        _async_session_factory = sessionmaker(
            bind=get_async_engine(),
            class_=AsyncSession,
            expire_on_commit=False,
            autocommit=False,
            autoflush=False,
        )
    return _async_session_factory


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """
    비동기 세션 의존성

    사용법:
        async def endpoint(session: AsyncSession = Depends(get_async_session)):
            ...
    """
    factory = get_session_factory()
    async with factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """
    데이터베이스 테이블 생성 (개발 환경 전용)
    프로덕션에서는 Alembic 마이그레이션 사용
    """
    engine = get_async_engine()
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def close_db() -> None:
    """데이터베이스 연결 종료"""
    global _async_engine, _async_session_factory
    if _async_engine is not None:
        await _async_engine.dispose()
        _async_engine = None
        _async_session_factory = None
