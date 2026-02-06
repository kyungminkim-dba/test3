"""
인증 API 엔드포인트
회원가입, 로그인, 토큰 갱신
"""

import jwt
from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser, DbSession
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.crud.user import user_crud
from app.schemas.auth import (
    LoginRequest,
    RefreshTokenRequest,
    Token,
    TokenWithUser,
)
from app.schemas.user import UserCreate, UserRead

router = APIRouter(prefix="/auth", tags=["인증"])


@router.post(
    "/register",
    response_model=TokenWithUser,
    status_code=status.HTTP_201_CREATED,
    summary="회원가입",
)
async def register(
    user_create: UserCreate,
    session: DbSession,
) -> TokenWithUser:
    """
    새 사용자 등록

    - 이메일 중복 확인
    - 사용자명 중복 확인
    - 비밀번호 Argon2 해싱
    - Access Token + Refresh Token 발급
    """
    # 이메일 중복 확인
    existing_user = await user_crud.get_user_by_email(session, user_create.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 등록된 이메일입니다",
        )

    # 사용자명 중복 확인
    existing_username = await user_crud.get_user_by_username(
        session, user_create.username
    )
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 사용 중인 사용자명입니다",
        )

    # 사용자 생성
    user = await user_crud.create_user(session, user_create)

    # 토큰 발급
    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)

    # Refresh Token DB 저장
    await user_crud.save_refresh_token(session, user.id, refresh_token)

    return TokenWithUser(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserRead.model_validate(user),
    )


@router.post(
    "/login",
    response_model=TokenWithUser,
    summary="로그인",
)
async def login(
    login_request: LoginRequest,
    session: DbSession,
) -> TokenWithUser:
    """
    사용자 로그인

    - 이메일/비밀번호 검증
    - Access Token + Refresh Token 발급
    """
    user = await user_crud.authenticate_user(
        session,
        login_request.email,
        login_request.password,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다",
        )

    # 토큰 발급
    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)

    # Refresh Token DB 저장
    await user_crud.save_refresh_token(session, user.id, refresh_token)

    return TokenWithUser(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserRead.model_validate(user),
    )


@router.post(
    "/refresh",
    response_model=Token,
    summary="토큰 갱신",
)
async def refresh_token(
    refresh_request: RefreshTokenRequest,
    session: DbSession,
) -> Token:
    """
    Access Token 갱신 (Refresh Token 로테이션)

    - 기존 Refresh Token 검증
    - 기존 Refresh Token 무효화
    - 새 Access Token + Refresh Token 발급
    """
    token = refresh_request.refresh_token

    # JWT 토큰 디코딩
    try:
        payload = decode_token(token)

        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="유효하지 않은 토큰 타입입니다",
            )

        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="유효하지 않은 토큰입니다",
            )

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh Token이 만료되었습니다",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 토큰입니다",
        )

    # DB에서 Refresh Token 검증
    stored_token = await user_crud.verify_refresh_token(session, token)
    if not stored_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh Token이 유효하지 않거나 이미 사용되었습니다",
        )

    # 기존 토큰 무효화 (토큰 로테이션)
    await user_crud.revoke_refresh_token(session, token)

    # 새 토큰 발급
    new_access_token = create_access_token(subject=user_id)
    new_refresh_token = create_refresh_token(subject=user_id)

    # 새 Refresh Token DB 저장
    await user_crud.save_refresh_token(session, int(user_id), new_refresh_token)

    return Token(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
    )


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="로그아웃",
)
async def logout(
    current_user: CurrentUser,
    session: DbSession,
) -> None:
    """
    로그아웃

    - 현재 사용자의 모든 Refresh Token 무효화
    """
    await user_crud.revoke_all_user_tokens(session, current_user.id)
