from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from app.database import Base


class HabitationHazard(Base):
    __tablename__ = "habitation_hazard"

    habitation_id = Column(
        Integer,
        ForeignKey("habitation.habitation_id"),
        primary_key=True
    )

    zone_id = Column(
        Integer,
        ForeignKey("hazard_zone.zone_id"),
        primary_key=True
    )

    exposure_level = Column(String(50))

    exposure_score = Column(Numeric(5, 2))