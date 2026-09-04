from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RelocationPriorityResponse(BaseModel):
    priority_id: int
    habitation_id: int

    priority_score: Optional[float] = None
    priority_level: Optional[str] = None
    relocation_phase: Optional[str] = None
    computed_date: Optional[datetime] = None
    reason: Optional[str] = None

    class Config:
        from_attributes = True