from sqlalchemy import Column, Integer, Numeric, String, Text, ForeignKey, DateTime
from app.database import Base


class RelocationPriority(Base):
    __tablename__ = "relocation_priority"

    priority_id = Column(Integer, primary_key=True)

    habitation_id = Column(
        Integer,
        ForeignKey("habitation.habitation_id"),
        nullable=False
    )

    priority_score = Column(Numeric(5, 2))
    priority_level = Column(String(30))
    relocation_phase = Column(String(30))
    computed_date = Column(DateTime)
    reason = Column(Text)