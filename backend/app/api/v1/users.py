"""
사용자 API 엔드포인트
프로필 조회, 수정, 삭제
"""

from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser, DbSession
from app.crud.user import user_crud
from app.schemas.user import UserRead, UserUpdate

router = APIRouter(prefix="/users", tags=["사용자"])


@router.get(
    "/me",
    response_model=UserRead,
    summary="내 정보 조회",
)
async def get_current_user_info(
    current_user: CurrentUser,
) -> UserRead:
    """
    현재 로그인한 사용자 정보 조회
    """
    return UserRead.model_validate(current_user)


@router.put(
    "/me",
    response_model=UserRead,
    summary="내 정보 수정",
)
async def update_current_user(
    user_update: UserUpdate,
    current_user: CurrentUser,
    session: DbSession,
) -> UserRead:
    """
    현재 로그인한 사용자 정보 수정

    - 이메일 변경 시 중복 확인
    - 사용자명 변경 시 중복 확인
    - 비밀번호 변경 시 Argon2 해싱
    """
    # 이메일 중복 확인 (변경 요청 시)
    if user_update.email and user_update.email != current_user.email:
        existing_user = await user_crud.get_user_by_email(session, user_update.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이미 등록된 이메일입니다",
            )

    # 사용자명 중복 확인 (변경 요청 시)
    if user_update.username and user_update.username != current_user.username:
        existing_username = await user_crud.get_user_by_username(
            session, user_update.username
        )
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이미 사용 중인 사용자명입니다",
            )

    updated_user = await user_crud.update_user(session, current_user, user_update)
    return UserRead.model_validate(updated_user)


@router.delete(
    "/me",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="계정 삭제",
)
async def delete_current_user(
    current_user: CurrentUser,
    session: DbSession,
) -> None:
    """
    현재 로그인한 사용자 계정 삭제 (soft delete)

    - 계정 비활성화
    - 모든 Refresh Token 무효화
    """
    # 모든 토큰 무효화
    await user_crud.revoke_all_user_tokens(session, current_user.id)

    # 계정 비활성화 (soft delete)
    await user_crud.delete_user(session, current_user, soft_delete=True)
