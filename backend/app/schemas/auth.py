"""
인증 Pydantic 스키마
로그인, 토큰 발급/갱신 관련
"""

from pydantic import BaseModel, EmailStr, Field

from app.schemas.user import UserRead


class LoginRequest(BaseModel):
    """로그인 요청 스키마"""

    email: EmailStr
    password: str = Field(min_length=1)


class Token(BaseModel):
    """토큰 응답 스키마"""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenWithUser(BaseModel):
    """토큰 + 사용자 정보 응답 스키마"""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserRead


class RefreshTokenRequest(BaseModel):
    """Refresh Token 요청 스키마"""

    refresh_token: str
