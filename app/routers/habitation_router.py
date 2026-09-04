from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.habitation import Habitation
from app.schemas.habitation import HabitationResponse


router = APIRouter(
    prefix="/habitations",
    tags=["Habitations"]
)


@router.get("/", response_model=list[HabitationResponse])
def get_habitations(db: Session = Depends(get_db)):

    habitations = db.query(Habitation).all()

    return habitations


@router.get(
    "/{habitation_id}",
    response_model=HabitationResponse
)
def get_habitation(
    habitation_id: int,
    db: Session = Depends(get_db)
):

    habitation = db.query(Habitation).filter(
        Habitation.habitation_id == habitation_id
    ).first()

    if habitation is None:
        raise HTTPException(
            status_code=404,
            detail="Habitation not found"
        )

    return habitation