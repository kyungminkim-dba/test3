"""
HashiCorp Vault 클라이언트 모듈
시크릿 조회 및 설정 로드
"""

import logging
from typing import Any, Optional

import hvac
from hvac.exceptions import VaultError

from app.core.config import settings

logger = logging.getLogger(__name__)


class VaultClient:
    """HashiCorp Vault 클라이언트"""

    def __init__(self):
        self._client: Optional[hvac.Client] = None

    @property
    def client(self) -> hvac.Client:
        """Vault 클라이언트 인스턴스 (지연 초기화)"""
        if self._client is None:
            self._client = hvac.Client(
                url=settings.VAULT_ADDR,
                token=settings.VAULT_TOKEN,
            )
        return self._client

    def is_authenticated(self) -> bool:
        """Vault 인증 상태 확인"""
        try:
            return self.client.is_authenticated()
        except Exception as e:
            logger.error(f"Vault 인증 확인 실패: {e}")
            return False

    def get_secret(self, path: str, mount_point: str = "secret") -> dict[str, Any]:
        """
        KV v2 시크릿 조회

        Args:
            path: 시크릿 경로 (예: "jwt", "database")
            mount_point: 마운트 포인트 (기본값: "secret")

        Returns:
            시크릿 데이터 딕셔너리

        Raises:
            VaultError: Vault 조회 실패
        """
        try:
            response = self.client.secrets.kv.v2.read_secret_version(
                path=path,
                mount_point=mount_point,
            )
            return response["data"]["data"]
        except VaultError as e:
            logger.error(f"Vault 시크릿 조회 실패 [{path}]: {e}")
            raise

    def get_secret_value(
        self,
        path: str,
        key: str,
        default: Optional[str] = None,
        mount_point: str = "secret",
    ) -> Optional[str]:
        """
        특정 시크릿 값 조회

        Args:
            path: 시크릿 경로
            key: 시크릿 키
            default: 기본값
            mount_point: 마운트 포인트

        Returns:
            시크릿 값 또는 기본값
        """
        try:
            secret = self.get_secret(path, mount_point)
            return secret.get(key, default)
        except VaultError:
            return default


# 전역 Vault 클라이언트 인스턴스
vault_client = VaultClient()


def load_secrets_to_settings() -> None:
    """
    Vault에서 시크릿을 로드하여 설정에 적용

    애플리케이션 시작 시 호출됨
    """
    try:
        if not vault_client.is_authenticated():
            logger.warning("Vault 인증 실패 - 환경 변수 설정 사용")
            return

        # JWT 시크릿 로드
        jwt_secrets = vault_client.get_secret("jwt")
        if jwt_secrets:
            if jwt_secrets.get("secret_key"):
                settings.JWT_SECRET_KEY = jwt_secrets["secret_key"]
            if jwt_secrets.get("algorithm"):
                settings.JWT_ALGORITHM = jwt_secrets["algorithm"]
            if jwt_secrets.get("access_token_expire_minutes"):
                settings.ACCESS_TOKEN_EXPIRE_MINUTES = int(
                    jwt_secrets["access_token_expire_minutes"]
                )
            if jwt_secrets.get("refresh_token_expire_days"):
                settings.REFRESH_TOKEN_EXPIRE_DAYS = int(
                    jwt_secrets["refresh_token_expire_days"]
                )
            logger.info("Vault에서 JWT 시크릿 로드 완료")

        # 데이터베이스 시크릿 로드 (선택적)
        try:
            db_secrets = vault_client.get_secret("database")
            if db_secrets:
                if db_secrets.get("password"):
                    settings.MYSQL_PASSWORD = db_secrets["password"]
                logger.info("Vault에서 데이터베이스 시크릿 로드 완료")
        except VaultError:
            logger.debug("데이터베이스 시크릿 없음 - 환경 변수 사용")

    except Exception as e:
        logger.error(f"Vault 시크릿 로드 실패: {e}")
        logger.warning("환경 변수 설정으로 폴백")
