import logging
import os
from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from src.db.session import SessionDependency
from src.role import UserRole, UserStatus
from src.schemas import PublicUserCreate
import src.services.auth_service as auth_service
from src.services.auth_service import Token

router = APIRouter(prefix="/auth", tags=["auth"])
logger = logging.getLogger("uvicorn.error")

# to get a string like this run:
# openssl rand -hex 32
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"


@router.post("/token")
async def login(
    login_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: SessionDependency,
) -> Token:
    """Authenticate an approved user and return a bearer token."""
    logger.info("Login email check: %s", login_data.username)

    user = await auth_service.validateUserLogin(
        login_data.username,
        login_data.password,
        session,
    )

    if not user:
        logger.info("Login not successful.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Users cannot log in until an administrator approves them.
    if user.status != UserStatus.APPROVED:
        logger.info("User status is not approved: %s", user.status)
        raise HTTPException(
            status_code=status.HTTP_423_LOCKED,
            detail=f"User status is {user.status}; organisation admin approval is required.",
        )

    logger.info("Login successful.")
    access_token_expires = timedelta(minutes=auth_service.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def sign_up_user(
    sign_up_data: PublicUserCreate,
    session: SessionDependency,
) -> bool:
    """Create a pending standard user through the public signup flow."""
    return await auth_service.validateSignUp(
        org_name=sign_up_data.organisation_name,
        email=sign_up_data.email,
        password=sign_up_data.password,
        role=UserRole.USER,
        user_status=UserStatus.PENDING,
        session=session,
    )


# Token operations
# Method reused from fastapi documentation.
def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)  # type: ignore
    return encoded_jwt
