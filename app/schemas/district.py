from pydantic import BaseModel


class DistrictResponse(BaseModel):
    district_id: int
    state_id: int
    name: str

    class Config:
        from_attributes = True