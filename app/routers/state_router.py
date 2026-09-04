from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.state import State
from app.schemas.state import StateResponse
from app.models.district import District
from app.schemas.district import DistrictResponse


router = APIRouter(
    prefix="/states",
    tags=["States"]
)


@router.get("/", response_model=list[StateResponse])
def get_states(db: Session = Depends(get_db)):

    states = db.query(State).all()

    return states
@router.get(
    "/{state_id}/districts",
    response_model=list[DistrictResponse]
)
def get_state_districts(
    state_id: int,
    db: Session = Depends(get_db)
):

    districts = db.query(District).filter(
        District.state_id == state_id
    ).all()

    return districts