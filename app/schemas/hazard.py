from pydantic import BaseModel
from typing import Optional


class HazardTypeResponse(BaseModel):
    hazard_type_id: int
    name: str
    hazard_level: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True


class HazardZoneResponse(BaseModel):
    zone_id: int
    hazard_type_id: int
    source_id: Optional[int] = None
    zone_name: str
    intensity_level: Optional[float] = None
    risk_score: Optional[float] = None

    class Config:
        from_attributes = True