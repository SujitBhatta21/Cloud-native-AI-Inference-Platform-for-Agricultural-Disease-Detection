"""Top-level API router registration."""

from fastapi import APIRouter

from src.api.inspect import router as inspect_router
from src.api.submissions import router as submissions_router
from src.api.auth import router as auth_router
from src.api.users import router as users_router
from src.api.admin import router as admin_router


api_router = APIRouter()
api_router.include_router(inspect_router)
api_router.include_router(submissions_router)
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(admin_router)
