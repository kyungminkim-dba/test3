"""
FastAPI 애플리케이션 진입점
uvicorn에서 이 파일을 참조합니다.
"""

from app.main import app

__all__ = ["app"]
