from sqlalchemy import Column, Integer, Numeric, String, DateTime, ForeignKey
from app.database import Base


class HazardPrediction(Base):
    __tablename__ = "hazard_prediction"

    prediction_id = Column(Integer, primary_key=True)

    habitation_id = Column(
        Integer,
        ForeignKey("habitation.habitation_id")
    )

    hazard_type_id = Column(
        Integer,
        ForeignKey("hazard_type.hazard_type_id")
    )

    prediction_date = Column(DateTime)

    predicted_risk = Column(Numeric(5, 2))
    confidence_score = Column(Numeric(5, 2))
    model_version = Column(String(50))