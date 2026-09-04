from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.disaster_event import DisasterEvent
from app.models.habitation_disaster import HabitationDisaster
from app.models.habitation import Habitation
from app.models.hazard_type import HazardType

from app.schemas.disaster import (
    DisasterEventResponse,
    HabitationDisasterResponse,
    DisasterEventCreate
)



router = APIRouter(
    prefix="/disasters",
    tags=["Disaster History"]
)


@router.get(
    "/events",
    response_model=list[DisasterEventResponse]
)
def get_disaster_events(
    db: Session = Depends(get_db)
):
    return (
        db.query(DisasterEvent)
        .order_by(DisasterEvent.event_date.desc())
        .all()
    )


@router.get(
    "/events/{event_id}",
    response_model=DisasterEventResponse
)
def get_disaster_event(
    event_id: int,
    db: Session = Depends(get_db)
):

    event = (
        db.query(DisasterEvent)
        .filter(DisasterEvent.event_id == event_id)
        .first()
    )

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Disaster event not found"
        )

    return event


@router.get(
    "/habitation/{habitation_id}",
    response_model=list[HabitationDisasterResponse]
)
def get_habitation_disasters(
    habitation_id: int,
    db: Session = Depends(get_db)
):

    results = (
        db.query(HabitationDisaster)
        .filter(
            HabitationDisaster.habitation_id == habitation_id
        )
        .all()
    )

    if not results:
        raise HTTPException(
            status_code=404,
            detail="No disaster history found for this habitation"
        )

    return results
@router.get(
    "/habitation/{habitation_id}/details"
)
def get_habitation_disaster_details(
    habitation_id: int,
    db: Session = Depends(get_db)
):

    results = (
        db.query(
            Habitation.name.label("habitation"),
            DisasterEvent.event_id,
            DisasterEvent.event_date,
            HazardType.name.label("hazard"),
            DisasterEvent.severity,
            HabitationDisaster.impact_level,
            HabitationDisaster.casualties,
            HabitationDisaster.property_loss
        )
        .join(
            HabitationDisaster,
            Habitation.habitation_id ==
            HabitationDisaster.habitation_id
        )
        .join(
            DisasterEvent,
            HabitationDisaster.event_id ==
            DisasterEvent.event_id
        )
        .join(
            HazardType,
            DisasterEvent.hazard_type_id ==
            HazardType.hazard_type_id
        )
        .filter(
            Habitation.habitation_id == habitation_id
        )
        .order_by(DisasterEvent.event_date.desc())
        .all()
    )

    if not results:
        raise HTTPException(
            status_code=404,
            detail="No disaster history found"
        )

    # Convert SQLAlchemy Row objects into dictionaries
    return [
        {
            "habitation": row.habitation,
            "event_id": row.event_id,
            "event_date": row.event_date,
            "hazard": row.hazard,
            "severity": float(row.severity) if row.severity is not None else None,
            "impact_level": row.impact_level,
            "casualties": row.casualties,
            "property_loss": float(row.property_loss)
            if row.property_loss is not None else None
        }
        for row in results
    ]
@router.post(
    "/events",
    response_model=DisasterEventResponse
)
def create_disaster_event(
    event: DisasterEventCreate,
    db: Session = Depends(get_db)
):
    new_event = DisasterEvent(
        hazard_type_id=event.hazard_type_id,
        event_date=event.event_date,
        severity=event.severity,
        casualties=event.casualties,
        property_loss=event.property_loss,
        description=event.description
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event