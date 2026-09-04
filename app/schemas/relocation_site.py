from pydantic import BaseModel
from typing import Optional


class RelocationSiteResponse(BaseModel):
    site_id: int
    district_id: Optional[int] = None
    name: str
    available_area_sqkm: Optional[float] = None
    land_ownership: Optional[str] = None
    suitability_score: Optional[float] = None

    class Config:
        from_attributes = True


class CarryingCapacityResponse(BaseModel):
    capacity_id: int
    site_id: int
    planned_capacity: Optional[int] = None
    max_households: Optional[int] = None
    water_availability: Optional[float] = None
    environmental_clearance_status: Optional[str] = None

    class Config:
        from_attributes = True