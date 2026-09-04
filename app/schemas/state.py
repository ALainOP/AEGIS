from pydantic import BaseModel


class StateResponse(BaseModel):
    state_id: int
    name: str
    region: str | None = None

    class Config:
        from_attributes = True