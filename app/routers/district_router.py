from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.district import District
from app.schemas.district import DistrictResponse
from app.models.habitation import Habitation
from app.schemas.habitation import HabitationResponse

router = APIRouter(
    prefix="/districts",
    tags=["Districts"]
)


@router.get("/", response_model=list[DistrictResponse])
def get_districts(db: Session = Depends(get_db)):

    districts = db.query(District).all()

    return districts


@router.get("/{district_id}", response_model=DistrictResponse)
def get_district(district_id: int, db: Session = Depends(get_db)):

    district = db.query(District).filter(
        District.district_id == district_id
    ).first()

    if district is None:
        raise HTTPException(
            status_code=404,
            detail="District not found"
        )

    return district
@router.get(
    "/{district_id}/habitations",
    response_model=list[HabitationResponse]
)
def get_district_habitations(
    district_id: int,
    db: Session = Depends(get_db)
):

    habitations = db.query(Habitation).filter(
        Habitation.district_id == district_id
    ).all()

    return habitations