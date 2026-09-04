from pydantic import BaseModel
from typing import Optional


class HabitationResponse(BaseModel):
    habitation_id: int
    district_id: int
    name: str
    population: Optional[int] = None
    households: Optional[int] = None
    area_sqkm: Optional[float] = None
    infrastructure_score: Optional[float] = None

    class Config:
        from_attributes = True