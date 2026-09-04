from sqlalchemy import Column, Integer, Numeric, String, ForeignKey


from app.database import Base


class HabitationDisaster(Base):
    __tablename__ = "habitation_disaster"

    habitation_id = Column(
        Integer,
        ForeignKey("habitation.habitation_id"),
        primary_key=True
    )

    event_id = Column(
        Integer,
        ForeignKey("disaster_event.event_id"),
        primary_key=True
    )

    impact_level = Column(String(50))
    casualties = Column(Integer, default=0)
    property_loss = Column(Numeric(15, 2))