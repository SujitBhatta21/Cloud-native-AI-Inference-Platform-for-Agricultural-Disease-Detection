"""Organisation administration endpoints."""

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select

from src.db.session import SessionDependency
from src.models import Inspection, User
from src.role import UserRole, UserStatus
from src.schemas import (
    AdminUserCreate,
    InspectResponse,
    OrgInspectionsResponse,
    UserStatusUpdates,
)
import src.services.auth_service as auth_service


router = APIRouter(prefix="/admin", tags=["admin"])


async def require_admin(jwt_token: str, session: SessionDependency) -> User:
    current_user = await auth_service.get_current_user(jwt_token, session)
    if current_user.role != UserRole.ADMIN or current_user.status != UserStatus.APPROVED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Approved admin access required",
        )
    return current_user


@router.get("/dashboard", response_model=OrgInspectionsResponse)
async def get_dashboard(
    jwt_token: Annotated[str, Depends(auth_service.oauth2_scheme)],
    session: SessionDependency,
) -> OrgInspectionsResponse:
    await require_admin(jwt_token, session)
    all_user_count, inspections, human_corrected_count, pending_users = (
        await auth_service.get_all_inspections_by_org(jwt_token, session)
    )
    return OrgInspectionsResponse(
        all_user_count=all_user_count,
        inspections=inspections,
        human_corrected_count=human_corrected_count,
        pending_users=pending_users,
    )


@router.post("/admins", status_code=status.HTTP_201_CREATED)
async def create_admin(
    sign_up_data: AdminUserCreate,
    jwt_token: Annotated[str, Depends(auth_service.oauth2_scheme)],
    session: SessionDependency,
) -> bool:
    current_admin = await require_admin(jwt_token, session)
    organisation_name = await auth_service.get_org_name(
        current_admin.organisation_id,
        session,
    )
    if organisation_name is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organisation not found",
        )

    return await auth_service.validateSignUp(
        org_name=organisation_name,
        email=sign_up_data.email,
        password=sign_up_data.password,
        role=UserRole.ADMIN,
        user_status=UserStatus.APPROVED,
        session=session,
    )


@router.patch("/users/status")
async def update_user_statuses(
    updates: UserStatusUpdates,
    jwt_token: Annotated[str, Depends(auth_service.oauth2_scheme)],
    session: SessionDependency,
) -> bool:
    await require_admin(jwt_token, session)
    return await auth_service.update_status(updates, jwt_token, session)


@router.get("/users/{user_id}/inspections", response_model=list[InspectResponse])
async def get_user_inspections(
    user_id: uuid.UUID,
    jwt_token: Annotated[str, Depends(auth_service.oauth2_scheme)],
    session: SessionDependency,
) -> list[Inspection]:
    current_admin = await require_admin(jwt_token, session)
    result = await session.execute(
        select(Inspection)
        .join(User, User.id == Inspection.user_id)
        .where(
            Inspection.user_id == user_id,
            User.organisation_id == current_admin.organisation_id,
        )
    )
    return list(result.scalars().all())
