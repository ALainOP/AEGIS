from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.relocation_site import RelocationSite
from app.models.carrying_capacity import CarryingCapacity
from app.schemas.relocation_site import (
    RelocationSiteResponse,
    CarryingCapacityResponse
)


router = APIRouter(
    prefix="/relocation-sites",
    tags=["Relocation Sites"]
)


@router.get(
    "/",
    response_model=list[RelocationSiteResponse]
)
def get_relocation_sites(
    db: Session = Depends(get_db)
):
    return (
        db.query(RelocationSite)
        .order_by(RelocationSite.suitability_score.desc())
        .all()
    )


@router.get(
    "/suitable",
    response_model=list[RelocationSiteResponse]
)
def get_suitable_sites(
    db: Session = Depends(get_db)
):
    return (
        db.query(RelocationSite)
        .filter(RelocationSite.suitability_score >= 85)
        .order_by(RelocationSite.suitability_score.desc())
        .all()
    )


@router.get(
    "/{site_id}",
    response_model=RelocationSiteResponse
)
def get_relocation_site(
    site_id: int,
    db: Session = Depends(get_db)
):

    site = (
        db.query(RelocationSite)
        .filter(RelocationSite.site_id == site_id)
        .first()
    )

    if site is None:
        raise HTTPException(
            status_code=404,
            detail="Relocation site not found"
        )

    return site


@router.get(
    "/{site_id}/capacity",
    response_model=CarryingCapacityResponse
)
def get_site_capacity(
    site_id: int,
    db: Session = Depends(get_db)
):

    capacity = (
        db.query(CarryingCapacity)
        .filter(CarryingCapacity.site_id == site_id)
        .first()
    )

    if capacity is None:
        raise HTTPException(
            status_code=404,
            detail="Carrying capacity not found"
        )

    return capacity