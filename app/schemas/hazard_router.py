from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.hazard_type import HazardType
from app.models.hazard_zone import HazardZone
from app.models.habitation import Habitation
from app.models.habitation_hazard import HabitationHazard

from app.schemas.hazard import HazardTypeResponse, HazardZoneResponse

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
@router.get("/habitation/{habitation_id}/details")
def get_habitation_hazards(habitation_id: int, db: Session = Depends(get_db)):

    results = (
        db.query(
            Habitation.name.label("habitation"),
            HazardType.name.label("hazard"),
            HazardZone.zone_name,
            HazardZone.risk_score,
            HabitationHazard.exposure_level,
            HabitationHazard.exposure_score
        )
        .join(HabitationHazard,
              Habitation.habitation_id == HabitationHazard.habitation_id)
        .join(HazardZone,
              HabitationHazard.zone_id == HazardZone.zone_id)
        .join(HazardType,
              HazardZone.hazard_type_id == HazardType.hazard_type_id)
        .filter(Habitation.habitation_id == habitation_id)
        .all()
    )

    return results