"""
사용자 CRUD 로직
생성, 조회, 인증, Refresh Token 관리
"""

from datetime import datetime, timedelta, timezone
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.config import settings
from app.core.security import (
    get_password_hash,
    hash_token,
    verify_password,
)
from app.models.user import RefreshToken, User
from app.schemas.user import UserCreate, UserUpdate


class UserCRUD:
    """사용자 CRUD 클래스"""

    async def create_user(
        self,
        session: AsyncSession,
        user_create: UserCreate,
    ) -> User:
        """
        새 사용자 생성

        Args:
            session: 데이터베이스 세션
            user_create: 회원가입 데이터

        Returns:
            생성된 User 객체
        """
        hashed_password = get_password_hash(user_create.password)
        user = User(
            email=user_create.email,
            username=user_create.username,
            hashed_password=hashed_password,
            full_name=user_create.full_name,
        )
        session.add(user)
        await session.flush()
        await session.refresh(user)
        return user

    async def get_user_by_id(
        self,
        session: AsyncSession,
        user_id: int,
    ) -> Optional[User]:
        """ID로 사용자 조회"""
        result = await session.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def get_user_by_email(
        self,
        session: AsyncSession,
        email: str,
    ) -> Optional[User]:
        """이메일로 사용자 조회"""
        result = await session.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def get_user_by_username(
        self,
        session: AsyncSession,
        username: str,
    ) -> Optional[User]:
        """사용자명으로 사용자 조회"""
        result = await session.execute(select(User).where(User.username == username))
        return result.scalar_one_or_none()

    async def authenticate_user(
        self,
        session: AsyncSession,
        email: str,
        password: str,
    ) -> Optional[User]:
        """
        사용자 인증 (로그인)

        Args:
            session: 데이터베이스 세션
            email: 이메일
            password: 비밀번호

        Returns:
            인증 성공 시 User 객체, 실패 시 None
        """
        user = await self.get_user_by_email(session, email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        if not user.is_active:
            return None
        return user

    async def update_user(
        self,
        session: AsyncSession,
        user: User,
        user_update: UserUpdate,
    ) -> User:
        """
        사용자 정보 업데이트

        Args:
            session: 데이터베이스 세션
            user: 기존 User 객체
            user_update: 업데이트 데이터

        Returns:
            업데이트된 User 객체
        """
        update_data = user_update.model_dump(exclude_unset=True)

        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

        for field, value in update_data.items():
            setattr(user, field, value)

        user.updated_at = datetime.utcnow()
        session.add(user)
        await session.flush()
        await session.refresh(user)
        return user

    async def delete_user(
        self,
        session: AsyncSession,
        user: User,
        soft_delete: bool = True,
    ) -> None:
        """
        사용자 삭제

        Args:
            session: 데이터베이스 세션
            user: 삭제할 User 객체
            soft_delete: True면 비활성화, False면 완전 삭제
        """
        if soft_delete:
            user.is_active = False
            user.updated_at = datetime.utcnow()
            session.add(user)
        else:
            await session.delete(user)
        await session.flush()

    # ========== Refresh Token 관리 ==========

    async def save_refresh_token(
        self,
        session: AsyncSession,
        user_id: int,
        token: str,
    ) -> RefreshToken:
        """
        Refresh Token 저장

        Args:
            session: 데이터베이스 세션
            user_id: 사용자 ID
            token: Refresh Token 문자열

        Returns:
            저장된 RefreshToken 객체
        """
        token_hash = hash_token(token)
        expires_at = datetime.now(timezone.utc) + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )

        refresh_token = RefreshToken(
            user_id=user_id,
            token_hash=token_hash,
            expires_at=expires_at,
        )
        session.add(refresh_token)
        await session.flush()
        return refresh_token

    async def verify_refresh_token(
        self,
        session: AsyncSession,
        token: str,
    ) -> Optional[RefreshToken]:
        """
        Refresh Token 검증

        Args:
            session: 데이터베이스 세션
            token: Refresh Token 문자열

        Returns:
            유효한 RefreshToken 객체 또는 None
        """
        token_hash = hash_token(token)
        result = await session.execute(
            select(RefreshToken).where(
                RefreshToken.token_hash == token_hash,
                RefreshToken.is_revoked == False,  # noqa: E712
                RefreshToken.expires_at > datetime.now(timezone.utc),
            )
        )
        return result.scalar_one_or_none()

    async def revoke_refresh_token(
        self,
        session: AsyncSession,
        token: str,
    ) -> bool:
        """
        Refresh Token 무효화

        Args:
            session: 데이터베이스 세션
            token: Refresh Token 문자열

        Returns:
            무효화 성공 여부
        """
        token_hash = hash_token(token)
        result = await session.execute(
            select(RefreshToken).where(RefreshToken.token_hash == token_hash)
        )
        refresh_token = result.scalar_one_or_none()

        if refresh_token:
            refresh_token.is_revoked = True
            session.add(refresh_token)
            await session.flush()
            return True
        return False

    async def revoke_all_user_tokens(
        self,
        session: AsyncSession,
        user_id: int,
    ) -> int:
        """
        사용자의 모든 Refresh Token 무효화 (로그아웃 시)

        Args:
            session: 데이터베이스 세션
            user_id: 사용자 ID

        Returns:
            무효화된 토큰 수
        """
        result = await session.execute(
            select(RefreshToken).where(
                RefreshToken.user_id == user_id,
                RefreshToken.is_revoked == False,  # noqa: E712
            )
        )
        tokens = result.scalars().all()

        for token in tokens:
            token.is_revoked = True
            session.add(token)

        await session.flush()
        return len(tokens)


# 싱글톤 인스턴스
user_crud = UserCRUD()
