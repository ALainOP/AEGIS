from pydantic import BaseModel
from typing import Optional
from datetime import date



class DisasterEventCreate(BaseModel):
    hazard_type_id: int
    event_date: date
    severity: Optional[float] = None
    casualties: Optional[int] = 0
    property_loss: Optional[float] = None
    description: Optional[str] = None


class DisasterEventResponse(BaseModel):
    event_id: int
    hazard_type_id: int
    event_date: date

    severity: Optional[float] = None
    casualties: Optional[int] = None
    property_loss: Optional[float] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True


class HabitationDisasterResponse(BaseModel):
    habitation_id: int
    event_id: int

    impact_level: Optional[str] = None
    casualties: Optional[int] = None
    property_loss: Optional[float] = None

    class Config:
        from_attributes = True