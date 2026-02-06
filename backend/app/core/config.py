"""
애플리케이션 설정 모듈
Pydantic Settings를 사용하여 환경 변수 관리
"""

from functools import lru_cache
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """애플리케이션 설정"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # 애플리케이션 설정
    APP_NAME: str = "Claude NextJS Starter Kit API"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"

    # MySQL 데이터베이스 설정
    MYSQL_HOST: str = "host.docker.internal"
    MYSQL_PORT: int = 3306
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = ""
    MYSQL_DATABASE: str = "starterkit_db"

    # Vault 설정
    VAULT_ADDR: str = "http://vault:8200"
    VAULT_TOKEN: str = "dev-root-token"

    # JWT 설정 (Vault에서 로드되거나 환경 변수에서 설정)
    JWT_SECRET_KEY: Optional[str] = None
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS 설정
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    @property
    def async_database_url(self) -> str:
        """비동기 MySQL 연결 URL (asyncmy 드라이버)"""
        return (
            f"mysql+asyncmy://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
            f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"
        )

    @property
    def sync_database_url(self) -> str:
        """동기 MySQL 연결 URL (Alembic 마이그레이션용)"""
        return (
            f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
            f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"
        )


@lru_cache
def get_settings() -> Settings:
    """설정 싱글톤 인스턴스 반환"""
    return Settings()


settings = get_settings()
