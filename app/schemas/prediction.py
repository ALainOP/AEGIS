from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class HazardPredictionResponse(BaseModel):
    prediction_id: int
    habitation_id: Optional[int] = None
    hazard_type_id: Optional[int] = None

    prediction_date: Optional[datetime] = None

    predicted_risk: Optional[float] = None
    confidence_score: Optional[float] = None
    model_version: Optional[str] = None

    class Config:
        from_attributes = True