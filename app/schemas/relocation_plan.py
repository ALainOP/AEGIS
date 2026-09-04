from pydantic import BaseModel
from typing import Optional
from datetime import date


class RelocationPlanResponse(BaseModel):
    plan_id: int
    habitation_id: int
    site_id: int

    planned_households: Optional[int] = None
    status: Optional[str] = None
    plan_date: Optional[date] = None
    relocation_phase: Optional[str] = None
    approved_by: Optional[int] = None

    class Config:
        from_attributes = True