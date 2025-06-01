from fastapi import APIRouter

from src.web.routers import (
    chat
)

router = APIRouter()
router.include_router(chat.router)