from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.hazard_type import HazardType
from app.models.hazard_zone import HazardZone
from app.schemas.hazard import (
    HazardTypeResponse,
    HazardZoneResponse
)


router = APIRouter(
    prefix="/hazards",
    tags=["Hazards"]
)


@router.get(
    "/",
    response_model=list[HazardTypeResponse]
)
def get_hazards(db: Session = Depends(get_db)):

    hazards = db.query(HazardType).all()

    return hazards


@router.get(
    "/zones",
    response_model=list[HazardZoneResponse]
)
def get_hazard_zones(db: Session = Depends(get_db)):

    zones = db.query(HazardZone).all()

    return zones