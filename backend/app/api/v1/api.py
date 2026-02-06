"""
API v1 라우터 통합
"""

from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router

api_router = APIRouter(prefix="/api/v1")

# 라우터 등록
api_router.include_router(auth_router)
api_router.include_router(users_router)
