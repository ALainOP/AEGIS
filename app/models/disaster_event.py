from sqlalchemy import Column, Integer, Numeric, Date, Text, ForeignKey
from app.database import Base


class DisasterEvent(Base):
    __tablename__ = "disaster_event"

    event_id = Column(Integer, primary_key=True)

    hazard_type_id = Column(
        Integer,
        ForeignKey("hazard_type.hazard_type_id"),
        nullable=False
    )

    event_date = Column(Date, nullable=False)

    severity = Column(Numeric(5, 2))
    casualties = Column(Integer, default=0)
    property_loss = Column(Numeric(15, 2))
    description = Column(Text)